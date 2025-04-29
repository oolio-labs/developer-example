interface ConnectButtonProps {
}

const ConnectButton: React.FC<ConnectButtonProps> = () => {
  return (
    <form
      method="post"
      action="/auth/connect/oolio"
    >
      <button type="submit" className="connect-button">
        Connect with Oolio
      </button>
    </form>
  );
};

export default ConnectButton;
