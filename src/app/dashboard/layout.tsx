'use client'
import { Button, Stack } from "@mantine/core";
import Link from "next/link";
import '@mantine/notifications/styles.css';

const listMenu = [
    {
        title: "Dashboard",
        link: "/dashboard"
    },
    {
        title: "Nginx",
        link: "/dashboard/nginx"
    },
    {
        title: "Process",
        link: "/dashboard/process"
    },
    {
        title: "Overviews",
        link: "/dashboard/overviews"
    }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <Stack>
        <Button.Group>
            {listMenu.map((item, index) => (
                <Button key={index} component={Link} href={item.link}>
                    {item.title}
                </Button>
            ))}
        </Button.Group>
        {children}
    </Stack>
}