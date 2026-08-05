const getDateRange = (period) => {
  const endDate = new Date();
  const startDate = new Date();
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'lastWeek':
      startDate.setDate(startDate.getDate() - 14);
      endDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'lastMonth':
      startDate.setMonth(startDate.getMonth() - 2);
      endDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'lastYear':
      startDate.setFullYear(startDate.getFullYear() - 2);
      endDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }
  return { startDate, endDate };
};

const groupByField = (data, field) => {
  if (!data || !Array.isArray(data)) return {};
  return data.reduce((groups, item) => {
    const key = item[field] || 'unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) {
    if (current > 0) return 100;
    return 0;
  }
  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth * 100) / 100;
};

const formatAnalyticsData = (data) => {
  if (!data || typeof data !== 'object') return {};
  const formatted = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      formatted[key] = value.map((item) => ({
        ...item,
        label: item._id || item.label || key,
      }));
    } else if (typeof value === 'object' && value !== null) {
      formatted[key] = {
        value: value.value || value.total || 0,
        change: value.change || value.growth || 0,
        trend: value.change > 0 ? 'up' : value.change < 0 ? 'down' : 'stable',
      };
    } else {
      formatted[key] = value;
    }
  }
  return formatted;
};

export { getDateRange, groupByField, calculateGrowth, formatAnalyticsData };
