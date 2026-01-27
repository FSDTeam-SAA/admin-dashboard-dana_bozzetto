'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Check } from 'lucide-react';
import { notificationsAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ApiNotification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: { name?: string };
}

const notificationIcons: Record<string, string> = {
  document: '📄',
  task: '✓',
  approval: '📋',
  message: '💬',
};

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationsAPI.getAll();
      return res.data as { unreadCount: number; notifications: ApiNotification[] };
    },
    staleTime: 30000,
  });

  const notifications = data?.notifications || [];

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsAPI.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: () => toast.error('Failed to mark as read'),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsAPI.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: () => toast.error('Failed to mark all as read'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationsAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: () => toast.error('Failed to delete notification'),
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((n) => !n.isRead);
    return notifications;
  }, [activeTab, notifications]);

  const handleMarkAsRead = (id: string) => markReadMutation.mutate(id);
  const handleDeleteNotification = (id: string) => deleteMutation.mutate(id);
  const handleMarkAllAsRead = () => markAllMutation.mutate();

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
          <p className="text-slate-400">Manage your notifications and alerts</p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={markAllMutation.isPending}
          className="text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md disabled:opacity-50"
        >
          {markAllMutation.isPending ? 'Marking...' : 'Mark all as read'}
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')} className="w-full">
        <TabsList className="bg-slate-700 p-1 space-x-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-400 rounded px-4 py-2"
          >
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-400 rounded px-4 py-2"
          >
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 mt-6">
          {isLoading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center text-slate-300">
              Loading notifications...
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-white/10 bg-red-900/30 text-red-200 p-8 text-center">
              Failed to load notifications
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
              <p className="text-slate-400">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 flex items-start gap-4 hover:bg-slate-600 transition-colors"
              >
                <div className="text-2xl flex-shrink-0">
                  {notificationIcons[notification.type] || '🔔'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {notification.message || 'Notification'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.sender?.name ? `From: ${notification.sender.name}` : ''}
                      </p>
                      <span className="text-xs text-slate-500 mt-2 inline-block">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-slate-200">
                      {!notification.isRead && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="cursor-pointer"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="cursor-pointer text-red-400 focus:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
