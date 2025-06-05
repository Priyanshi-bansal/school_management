export const generateReceiptNumber = async () => {
  const prefix = 'REC';
  const year = new Date().getFullYear();
  const count = await FeePayment.countDocuments();
  return `${prefix}-${year}-${(count + 1).toString().padStart(5, '0')}`;
};
