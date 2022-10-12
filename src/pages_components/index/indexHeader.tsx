interface Props {
  userName?: string;
}
const IndexHeader = ({ userName }: Props) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl">
        {userName ? `👋 Hey ${userName}` : '👋 Hey friend'}
      </h1>
      <h1 className="text-3xl">Welcome to Communion!</h1>
    </div>
  );
};

export default IndexHeader;
