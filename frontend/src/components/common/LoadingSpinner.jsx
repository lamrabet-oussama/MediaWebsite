const LoadingSpinner = ({ size = "md" }) => {
  const sizeClass = `loading-${size}`;

  return (
    <span className={`loading text-or-website loading-spinner ${sizeClass}`} />
  );
};
export default LoadingSpinner;
