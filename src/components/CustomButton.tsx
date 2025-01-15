import { Button, Text } from "@mantine/core";
import Link from "next/link";

function CustomButton({
  children,
  href,
  leftSection,
  radius = 8,
  display,
}: {
  children: React.ReactNode;
  href: string;
  leftSection?: React.ReactNode;
  radius?: number;
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
      display={display}
      size="compact-xl"
      variant="outline"
      c="gray"
      px={"md"}
      py={"xs"}
      component={Link}
      href={href}
    >
      <Text>{children}</Text>
    </Button>
  );
}

export default CustomButton;
