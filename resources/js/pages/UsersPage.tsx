import { 
  Search, 
  Plus, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  MoreVertical,
  Check,
  X,
  Mail,
  MapPin
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, UserRole} from '@/types/users';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '@/types/users';

type ApiUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  profile?: {
    role?: UserRole;
    full_name?: string | null;
  } | null;
};

type PaginatedUsersResponse = {
  data: ApiUser[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

function RoleBadge({ role }: { role: UserRole }) {
  const config = {
    admin: { icon: ShieldCheck, className: 'bg-danger/15 text-danger' },
    agronome: { icon: Shield, className: 'bg-success/15 text-success' },
    autorite: { icon: ShieldAlert, className: 'bg-warning/15 text-warning' },
  };

  const { icon: Icon, className } = config[role];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${className}`}>
      <Icon size={12} />
      {ROLE_LABELS[role]}
    </span>
  );
}

function PermissionsList({ role }: { role: UserRole }) {
  const permissions = ROLE_PERMISSIONS[role];

  return (
    <div className="space-y-1">
      {permissions.map((perm, idx) => (
        <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
          <Check size={10} className="text-success" />
          <span>{perm}</span>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [serverSearch, setServerSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'agronome' as UserRole,
    password: '',
  });
  const [createErrors, setCreateErrors] = useState<Partial<Record<'name' | 'email' | 'role' | 'password', string>>>({});

  const fetchUsers = useCallback(async (options?: { page?: number; search?: string }) => {
    const targetPage = options?.page ?? page;
    const targetSearch = options?.search ?? serverSearch;
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(targetPage),
        per_page: '10',
        ...(targetSearch ? { search: targetSearch } : {}),
      }).toString();
      const response = await fetch(`/api/users?${query}`, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const payload = (await response.json()) as PaginatedUsersResponse;
      const mapped: User[] = payload.data.map((user) => ({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.profile?.role ?? 'agronome',
        region: '—',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(user.created_at),
      }));
      setUsers(mapped);
      setPage(payload.current_page);
      setLastPage(payload.last_page);
      setTotalUsers(payload.total);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, [page, serverSearch]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setServerSearch(searchQuery.trim());
      void fetchUsers({ page: 1, search: searchQuery.trim() });
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchUsers, searchQuery]);

  const validateCreateForm = () => {
    const nextErrors: Partial<Record<'name' | 'email' | 'role' | 'password', string>> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!createForm.name.trim()) nextErrors.name = 'Le nom est requis.';
    if (!emailPattern.test(createForm.email.trim())) nextErrors.email = 'Adresse email invalide.';
    if (!['admin', 'agronome', 'autorite'].includes(createForm.role)) nextErrors.role = 'Rôle invalide.';
    if (createForm.password.length < 8) nextErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.';

    setCreateErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createUser = async () => {
    if (!validateCreateForm()) return;

    try {
      setCreateSubmitting(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          role: createForm.role,
          password: createForm.password,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }
      toast.success('Utilisateur créé.');
      setCreateOpen(false);
      setCreateForm({ name: '', email: '', role: 'agronome', password: '' });
      setCreateErrors({});
      await fetchUsers({ page: 1, search: serverSearch });
    } catch (error) {
      console.error(error);
      toast.error("Échec de création de l'utilisateur.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const updateRole = async (userId: string, role: UserRole) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.status}`);
      }
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role } : user)),
      );
      setSelectedUser((prev) => (prev && prev.id === userId ? { ...prev, role } : prev));
      toast.success('Rôle mis à jour.');
    } catch (error) {
      console.error(error);
      toast.error('Échec de mise à jour du rôle.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedUser((prev) => (prev?.id === userId ? null : prev));
      toast.success('Utilisateur supprimé.');
    } catch (error) {
      console.error(error);
      toast.error("Échec de suppression de l'utilisateur.");
    }
  };

  const stats = useMemo(() => ({
    total: totalUsers,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    agronomes: users.filter(u => u.role === 'agronome').length,
    autorites: users.filter(u => u.role === 'autorite').length,
  }), [users, totalUsers]);

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Gestion des utilisateurs</h1>
              <p className="text-muted-foreground mt-1">
                Gérez les accès et les permissions des utilisateurs du système
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nouvel utilisateur
            </Button>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Créez un compte utilisateur avec un rôle initial.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Nom</label>
                  <Input
                    value={createForm.name}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom complet"
                  />
                  {createErrors.name ? <p className="text-xs text-danger">{createErrors.name}</p> : null}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="email@domaine.com"
                  />
                  {createErrors.email ? <p className="text-xs text-danger">{createErrors.email}</p> : null}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Rôle</label>
                  <Select
                    value={createForm.role}
                    onValueChange={(value) => setCreateForm((prev) => ({ ...prev, role: value as UserRole }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="agronome">Agronome</SelectItem>
                      <SelectItem value="autorite">Autorité locale</SelectItem>
                    </SelectContent>
                  </Select>
                  {createErrors.role ? <p className="text-xs text-danger">{createErrors.role}</p> : null}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Mot de passe initial</label>
                  <Input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Au moins 8 caractères"
                  />
                  {createErrors.password ? <p className="text-xs text-danger">{createErrors.password}</p> : null}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={createSubmitting}
                >
                  Annuler
                </Button>
                <Button onClick={createUser} disabled={createSubmitting}>
                  {createSubmitting ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-semibold text-foreground">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Actifs</div>
              <div className="text-2xl font-semibold text-success">{stats.active}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Admins</div>
              <div className="text-2xl font-semibold text-danger">{stats.admins}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Agronomes</div>
              <div className="text-2xl font-semibold text-foreground">{stats.agronomes}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Autorités</div>
              <div className="text-2xl font-semibold text-foreground">{stats.autorites}</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou région..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Rôle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Région</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Dernière connexion</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={6}>
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        {user.region}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-success text-sm">
                          <Check size={14} />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                          <X size={14} />
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.lastLogin 
                        ? user.lastLogin.toLocaleDateString('fr-FR') 
                        : 'Jamais connecté'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateRole(user.id, 'admin')}>
                            Définir Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole(user.id, 'agronome')}>
                            Définir Agronome
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateRole(user.id, 'autorite')}>
                            Définir Autorité
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-danger"
                            onClick={() => deleteUser(user.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {page} / {lastPage} ({totalUsers} utilisateurs)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => void fetchUsers({ page: page - 1, search: serverSearch })}
                >
                  Précédent
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= lastPage || loading}
                  onClick={() => void fetchUsers({ page: page + 1, search: serverSearch })}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>

          {/* Selected User Permissions */}
          {selectedUser && (
            <div className="mt-6 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleBadge role={selectedUser.role} />
                    <span className="text-sm text-muted-foreground">• {selectedUser.region ?? '—'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Permissions accordées</h4>
                <PermissionsList role={selectedUser.role} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
