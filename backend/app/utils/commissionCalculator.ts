export const calculateCommissions = (price: number) => {
  const platformCommissionRate = 0.05; // 5%
  const affiliateCommissionRate = 0.03; // 3%

  const platformCommission = price * platformCommissionRate;
  const affiliateCommission = price * affiliateCommissionRate;

  return {
    platformCommission,
    affiliateCommission,
    sellerAmount: price - platformCommission - affiliateCommission,
  };
};
