function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-300">{message}</p>;
}

export default ErrorMessage;
