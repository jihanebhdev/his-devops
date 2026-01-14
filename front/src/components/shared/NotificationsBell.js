import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { notificationsService } from '../../api/notifications';
import { useNavigate } from 'react-router-dom';
const NotificationsBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { data: unreadCountData, isLoading: countLoading } = useQuery(
    'notificationsUnreadCount',
    notificationsService.getUnreadCount,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery(
    'notifications',
    notificationsService.getAll,
    {
      enabled: open,
    }
  );
  const unreadCount = unreadCountData?.data?.count || 0;
  const notifications = notificationsData?.data || [];
  const markAsReadMutation = useMutation(
    (id) => notificationsService.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
      },
    }
  );
  const markAllAsReadMutation = useMutation(
    () => notificationsService.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
      },
    }
  );
  const deleteMutation = useMutation(
    (id) => notificationsService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notificationsUnreadCount');
      },
    }
  );
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMarkAsRead = (id, e) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };
  const handleNotificationClick = (notification) => {
    if (!notification.lu) {
      markAsReadMutation.mutate(notification.id);
    }
    handleClose();
    navigate('/notifications');
  };
  const getNotificationColor = (type) => {
    const colors = {
      INFO: 'info',
      SUCCESS: 'success',
      WARNING: 'warning',
      ERROR: 'error',
      URGENT: 'error',
    };
    return colors[type] || 'default';
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={countLoading ? 0 : unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isLoading}
            >
              Tout marquer comme lu
            </Button>
          )}
        </Box>
        <Divider />
        {notificationsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.lu ? 'transparent' : 'action.hover',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={getNotificationColor(notification.type)}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                    {!notification.lu && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(notification.dateCreation)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: notification.lu ? 400 : 600, mb: 0.5 }}>
                  {notification.titre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {notification.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                  {!notification.lu && (
                    <Button
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      disabled={markAsReadMutation.isLoading}
                    >
                      Marquer comme lu
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={(e) => handleDelete(notification.id, e)}
                    disabled={deleteMutation.isLoading}
                  >
                    Supprimer
                  </Button>
                </Box>
              </MenuItem>
            ))}
            {notifications.length > 5 && (
              <>
                <Divider />
                <MenuItem onClick={() => { handleClose(); navigate('/notifications'); }}>
                  <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
                    Voir toutes les notifications ({notifications.length})
                  </Typography>
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};
export default NotificationsBell;
