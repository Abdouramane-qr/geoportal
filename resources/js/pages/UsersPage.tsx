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
import { useState } from 'react';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { User, UserRole} from '@/types/users';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '@/types/users';


function RoleBadge({ role }: { role: UserRole }) {
  const config = {
    admin: { icon: ShieldCheck, className: 'bg-danger/15 text-danger' },
    agronome: { icon: Shield, className: 'bg-success/15 text-success' },
    autorité_locale: { icon: ShieldAlert, className: 'bg-warning/15 text-warning' },
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
  const [users] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    agronomes: users.filter(u => u.role === 'agronome').length,
    autorites: users.filter(u => u.role === 'autorité_locale').length,
  };

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
            <Button>
              <Plus size={16} className="mr-2" />
              Nouvel utilisateur
            </Button>
          </div>

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
                {filteredUsers.map((user) => (
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
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Réinitialiser le mot de passe</DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">Désactiver</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
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
                    <span className="text-sm text-muted-foreground">• {selectedUser.region}</span>
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
