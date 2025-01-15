import { Button, Text } from "@mantine/core";

function CustomButtonFun({
    children,
    leftSection,
    radius = 8,
    onClick,
    loading,
    display = "inline-block",
  }: {
    children: React.ReactNode;
    leftSection?: React.ReactNode;
    radius?: number;
    onClick?: () => void;
    loading?: boolean;
    display?: "inline-block" | "inline" | "block" | "flex" | "none";
  }) {
    return (
      <Button
        leftSection={leftSection}
        styles={{
          root: {
            border: "0.05px solid #444",
            borderRadius: radius,
          },
        }}
        size="compact-xl"
        variant="outline"
        c="gray"
        px={"md"}
        py={"xs"}
        onClick={onClick}
        loading={loading}
        display={display}
      >
        <Text>{children}</Text>
      </Button>
    );
  }

export default CustomButtonFun;