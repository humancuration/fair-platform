import axios from 'axios';

export const exportAsStatic = (data: any) => {
  const fileName = 'affiliate_links.json';
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportGroupData = (data: any, groupId: string) => {
  const fileName = `group_${groupId}_data.json`;
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};