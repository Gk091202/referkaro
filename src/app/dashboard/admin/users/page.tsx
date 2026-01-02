"use client";

import { useEffect, useState, useCallback } from "react";
import { UserX, UserCheck, Mail, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Avatar,
  LoadingPage,
  Alert,
  Select,
} from "@/components/ui";
import {
  getAllUsers,
  deactivateUser,
  reactivateUser,
} from "@/lib/appwrite/api";
import { formatDate } from "@/lib/utils";
import type { User, UserRole } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (user: User) => {
    setIsUpdating(user.$id);
    setError(null);
    try {
      if (user.isActive !== false) {
        await deactivateUser(user.$id);
      } else {
        await reactivateUser(user.$id);
      }
      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update user. Make sure 'isActive' attribute exists in Appwrite users collection."
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "primary";
      case "referrer":
        return "success";
      case "applicant":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <LoadingPage message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage platform users
          </p>
        </div>

        {/* Filter */}
        <div className="w-full sm:w-48">
          <Select
            label="Filter by Role"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "all", label: "All Users" },
              { value: "applicant", label: "Applicants" },
              { value: "referrer", label: "Referrers" },
              { value: "admin", label: "Admins" },
            ]}
          />
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.role === "applicant").length}
            </p>
            <p className="text-sm text-muted-foreground">Applicants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.role === "referrer").length}
            </p>
            <p className="text-sm text-muted-foreground">Referrers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-2xl font-bold text-foreground">
              {users.filter((u) => u.role === "admin").length}
            </p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No users found with the selected filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.$id}>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <Avatar name={user.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {user.name}
                        </h3>
                        <Badge variant={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                        {user.isActive === false && (
                          <Badge variant="destructive">Deactivated</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(user.$createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {user.role !== "admin" && (
                    <div>
                      {user.isActive !== false ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(user)}
                          disabled={isUpdating === user.$id}
                        >
                          <UserX className="mr-1 h-4 w-4" />
                          {isUpdating === user.$id
                            ? "Updating..."
                            : "Deactivate"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleToggleActive(user)}
                          disabled={isUpdating === user.$id}
                        >
                          <UserCheck className="mr-1 h-4 w-4" />
                          {isUpdating === user.$id
                            ? "Updating..."
                            : "Reactivate"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
