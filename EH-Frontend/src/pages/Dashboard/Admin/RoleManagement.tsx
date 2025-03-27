import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit, Trash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import axios from 'axios';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface Role {
  id: number;
  name: string;
  description: string;
  role_status: 'ENABLED' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

// Function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

const RoleManagement: React.FC = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRoles, setTotalRoles] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    role_status: 'ENABLED' as 'ENABLED' | 'DISABLED',
  });

  const [editRole, setEditRole] = useState<Partial<Role>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/roles?page=${page}&limit=${rowsPerPage}`);
      setRoles(response.data.roles);
      setTotalRoles(response.data.total);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive"
      });
    }
  };

  const validateRole = (role: typeof newRole | Partial<Role>, isEdit = false) => {
    const errors: { [key: string]: string } = {};

    if (!role.name?.trim()) {
      errors.name = 'Role Name is required';
    }

    if (!role.description?.trim()) {
      errors.description = 'Role Description is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRole = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateRole(newRole)) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/v1/roles`, newRole);
      setIsCreateDialogOpen(false);
      fetchRoles();
      toast({
        title: "Success",
        description: "New role created successfully!",
      });
      resetNewRoleForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleEditRole = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedRole || !validateRole(editRole, true)) {
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/v1/roles/${selectedRole.id}`, editRole);
      setIsEditDialogOpen(false);
      fetchRoles();
      toast({
        title: "Success",
        description: "Role updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/roles/${selectedRole.id}`);
      setIsDeleteDialogOpen(false);
      fetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully!",
        variant: "destructive"
      });
      setSelectedRole(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete role",
        variant: "destructive"
      });
    }
  };

  const resetNewRoleForm = () => {
    setNewRole({
      name: '',
      description: '',
      role_status: 'ENABLED',
    });
    setErrors({});
  };

  const handleEditOpen = (role: Role) => {
    setSelectedRole(role);
    setEditRole({
      id: role.id,
      name: role.name,
      description: role.description,
      role_status: role.role_status,
    });
    setIsEditDialogOpen(true);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.role_status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalRoles / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Manage system roles</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Roles</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search roles..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={role.role_status === 'ENABLED' ? 'default' : 'destructive'}
                    >
                      {role.role_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
                  <TableCell>{formatDate(role.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEditOpen(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the role
                              {selectedRole && ` "${selectedRole.name}"`}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteRole}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Section */}
          <div className="flex items-center justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handleChangePage(page - 1)}
                    isActive={page > 0}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === index}
                      onClick={() => handleChangePage(index)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handleChangePage(page + 1)}
                    isActive={page < totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Add a new role to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRole}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Role Name</Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 col-span-4 text-right">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
                {errors.description && <p className="text-red-500 col-span-4 text-right">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role_status" className="text-right">Status</Label>
                <Select
                  value={newRole.role_status}
                  onValueChange={(value: 'ENABLED' | 'DISABLED') => setNewRole({ ...newRole, role_status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENABLED">ENABLED</SelectItem>
                    <SelectItem value="DISABLED">DISABLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editName" className="text-right">Role Name</Label>
                <Input
                  id="editName"
                  name="name"
                  className="col-span-3"
                  value={editRole.name || ''}
                  onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 col-span-4 text-right">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDescription" className="text-right">Description</Label>
                <Input
                  id="editDescription"
                  name="description"
                  className="col-span-3"
                  value={editRole.description || ''}
                  onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                />
                {errors.description && <p className="text-red-500 col-span-4 text-right">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editRoleStatus" className="text-right">Status</Label>
                <Select
                  value={editRole.role_status || 'ENABLED'}
                  onValueChange={(value: 'ENABLED' | 'DISABLED') => setEditRole({ ...editRole, role_status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENABLED">ENABLED</SelectItem>
                    <SelectItem value="DISABLED">DISABLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;