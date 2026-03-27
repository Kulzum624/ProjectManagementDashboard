import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLoaderData, useSearchParams } from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
  }
};
const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces } = (useLoaderData() as { workspaces: Workspace[] }) || {
    workspaces: [],
  };
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(
    workspaces.length === 0
  );
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    workspaces.length > 0 ? workspaces[0] : null
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (currentWorkspace && !searchParams.get("workspaceId")) {
      setSearchParams({ workspaceId: currentWorkspace._id });
    }
  }, [currentWorkspace, searchParams, setSearchParams]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />

      <div className="flex flex-1 flex-col h-full">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto container p-6 md:p-10 pb-10 pr-6 md:pb-10 md:pr-16 w-full min-h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
