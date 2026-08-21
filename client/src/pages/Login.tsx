import { useState } from "react";
import { Button, Form, Input, App } from "antd";
import { useNavigate } from "react-router";
import { useAuth } from "../providers/authContext.ts";
import heyvLogo from "../assets/heyv-logo.png";

interface LoginFormValues {
  username: string;
  password: string;
}

function Login() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      await login(values.username, values.password);
      navigate("/", { replace: true });
    } catch {
      message.error("Nom d'utilisateur ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <img src={heyvLogo} alt="Heyv" className="mb-8 h-12" />
      <Form<LoginFormValues>
        name="login"
        layout="vertical"
        onFinish={handleFinish}
        className="w-full max-w-96"
        requiredMark={false}
      >
        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur." }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: "Veuillez entrer votre mot de passe." }]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
