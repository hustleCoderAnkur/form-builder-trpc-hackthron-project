import { DashboardShell } from "~/components/dashboard-shell"
import { GlobalProviders } from "~/components/global-providers"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalProviders>
      <DashboardShell>{children}</DashboardShell>
    </GlobalProviders>
  )
}
