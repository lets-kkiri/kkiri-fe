const useGetDday = (target: string) => {
  const targetTime = new Date(target);
  const todayTime = new Date();

  const diff = targetTime - todayTime;

  console.log('diff :', diff);
  let cnt;
  return 10;
};

export default useGetDday;
