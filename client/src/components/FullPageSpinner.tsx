import { Spin } from "antd";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin size="large" />
    </div>
  );
}

export default FullPageSpinner;
