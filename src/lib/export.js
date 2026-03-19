
export const exportToCSV = (data, fileName = 'whatsapp_work_log.csv') => {
  if (!data || data.length === 0) return;

  const headers = ['Date', 'Time', 'Sender', 'Message', 'Category', 'Links'];
  const csvRows = [];

  csvRows.push(headers.join(','));

  data.forEach((row) => {
    const values = [
      row.date,
      row.time,
      row.sender,
      `"${row.message.replace(/"/g, '""')}"`,
      row.categoryLabel || row.category,
      row.links.join('; '),
    ];
    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
