/**
 * Service for calculating statistics and worked hours from punch clock data
 */

import { auth, firestore } from './firebaseConfig';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

/**
 * Calculates worked hours for a given day
 * @param {Array} dayPunches - Array of punches for a specific day
 * @returns {Object} - { totalHours, totalMinutes, entries, exits }
 */
export const calculateDayHours = (dayPunches) => {
  if (!dayPunches || dayPunches.length === 0) {
    return { totalHours: 0, totalMinutes: 0, entries: [], exits: [] };
  }

  // Sort punches by time
  const sortedPunches = [...dayPunches].sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
    const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
    return timeA - timeB;
  });

  const entries = [];
  const exits = [];

  sortedPunches.forEach((punch, index) => {
    const isEntry = (index + 1) % 2 === 1;
    if (isEntry) {
      entries.push(punch);
    } else {
      exits.push(punch);
    }
  });

  let totalMinutes = 0;

  // Calculate hours between entry and exit pairs
  for (let i = 0; i < Math.min(entries.length, exits.length); i++) {
    const entryTime = entries[i].timestamp instanceof Date 
      ? entries[i].timestamp 
      : new Date(entries[i].timestamp);
    const exitTime = exits[i].timestamp instanceof Date 
      ? exits[i].timestamp 
      : new Date(exits[i].timestamp);
    
    const diffMs = exitTime - entryTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    totalMinutes += diffMinutes;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return {
    totalHours,
    totalMinutes: remainingMinutes,
    totalMinutesRaw: totalMinutes,
    entries: entries.length,
    exits: exits.length,
  };
};

/**
 * Gets all punches grouped by day
 * @returns {Promise<Object>} - Object with date keys and punch arrays
 */
export const getPunchesGroupedByDay = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return {};

    const punchesRef = collection(firestore, 'users', user.uid, 'punches');
    let querySnapshot;
    
    try {
      const q = query(punchesRef, orderBy('timestamp', 'desc'));
      querySnapshot = await getDocs(q);
    } catch (error) {
      querySnapshot = await getDocs(punchesRef);
    }

    const grouped = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate 
        ? data.timestamp.toDate() 
        : new Date(data.timestamp || data.createdAt?.toDate || data.createdAt);
      
      const dateKey = timestamp.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push({
        id: doc.id,
        time: data.time || 'N/A',
        timestamp: timestamp,
      });
    });

    // Sort punches within each day
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return timeA - timeB;
      });
    });

    return grouped;
  } catch (error) {
    console.error('Error getting punches grouped by day:', error);
    return {};
  }
};

/**
 * Gets all justifications
 * @returns {Promise<Array>} - Array of justifications
 */
export const getJustifications = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const justificationsRef = collection(firestore, 'users', user.uid, 'justifications');
    const querySnapshot = await getDocs(justificationsRef);

    const justifications = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      justifications.push({
        id: doc.id,
        date: data.date,
        text: data.text,
        createdAt: data.createdAt?.toDate || new Date(data.createdAt),
      });
    });

    return justifications.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting justifications:', error);
    return [];
  }
};

/**
 * Calculates monthly statistics
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Object>} - Statistics object
 */
export const getMonthlyStatistics = async (month, year) => {
  try {
    const groupedPunches = await getPunchesGroupedByDay();
    const justifications = await getJustifications();

    const monthStr = String(month).padStart(2, '0');
    const daysInMonth = new Date(year, month, 0).getDate();
    
    let totalHours = 0;
    let totalMinutes = 0;
    let workedDays = 0;
    let absentDays = 0;
    let justifiedDays = 0;
    const dailyStats = [];

    // Process each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateKey = `${dayStr}/${monthStr}/${year}`;
      
      const dayPunches = groupedPunches[dateKey] || [];
      const dayJustification = justifications.find(j => j.date === dateKey);

      if (dayPunches.length > 0) {
        const dayHours = calculateDayHours(dayPunches);
        totalHours += dayHours.totalHours;
        totalMinutes += dayHours.totalMinutesRaw;
        workedDays++;
        
        dailyStats.push({
          date: dateKey,
          hours: dayHours.totalHours,
          minutes: dayHours.totalMinutes,
          punches: dayPunches.length,
          justified: !!dayJustification,
        });
      } else {
        // Check if it's a weekend
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // Weekend - not counted as absent
        } else {
          absentDays++;
          if (dayJustification) {
            justifiedDays++;
          }
        }
      }
    }

    // Convert total minutes to hours
    const finalHours = totalHours + Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;

    return {
      month,
      year,
      totalHours: finalHours,
      totalMinutes: finalMinutes,
      workedDays,
      absentDays,
      justifiedDays,
      unjustifiedDays: absentDays - justifiedDays,
      dailyStats,
    };
  } catch (error) {
    console.error('Error calculating monthly statistics:', error);
    return {
      month,
      year,
      totalHours: 0,
      totalMinutes: 0,
      workedDays: 0,
      absentDays: 0,
      justifiedDays: 0,
      unjustifiedDays: 0,
      dailyStats: [],
    };
  }
};

/**
 * Gets current month statistics
 * @returns {Promise<Object>}
 */
export const getCurrentMonthStatistics = async () => {
  const now = new Date();
  return await getMonthlyStatistics(now.getMonth() + 1, now.getFullYear());
};

