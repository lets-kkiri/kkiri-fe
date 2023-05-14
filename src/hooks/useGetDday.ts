const useGetDday = (target: string) => {
  const targetTime = new Date(target);
  const todayTime = new Date();

  const diff = targetTime - todayTime;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export default useGetDday;
