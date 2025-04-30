
import MainLayout from "@/components/layout/MainLayout";
import InviteForm from "@/components/invitations/InviteForm";
import InvitationsList from "@/components/invitations/InvitationsList";

export default function Invitations() {
  return (
    <MainLayout isAdmin>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Invitations</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <InviteForm />
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Invitations</h2>
            <InvitationsList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

