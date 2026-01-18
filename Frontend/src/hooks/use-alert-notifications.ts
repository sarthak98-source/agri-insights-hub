import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert } from '@/lib/api';

export const useAlertNotifications = (alerts: Alert[]) => {
  const previousAlertsRef = useRef<Alert[]>([]);

  useEffect(() => {
    const previousAlerts = previousAlertsRef.current;
    
    // Only show notifications if alerts have changed
    if (previousAlerts.length > 0 && alerts.length > 0) {
      const lowStockAlerts = alerts.filter(a => a.type === 'low_stock');
      const overstockAlerts = alerts.filter(a => a.type === 'overstock');
      
      const prevLowStock = previousAlerts.filter(a => a.type === 'low_stock');
      const prevOverstock = previousAlerts.filter(a => a.type === 'overstock');

      // New low stock alert
      if (lowStockAlerts.length > prevLowStock.length) {
        const newAlerts = lowStockAlerts.filter(
          alert => !prevLowStock.some(prev => prev.productName === alert.productName)
        );
        
        newAlerts.forEach(alert => {
          toast({
            title: "🚨 Low Stock Alert!",
            description: `${alert.productName}: Only ${alert.currentStock} units left. Reorder recommended.`,
            variant: "destructive",
          });
        });
      }

      // New overstock alert
      if (overstockAlerts.length > prevOverstock.length) {
        const newAlerts = overstockAlerts.filter(
          alert => !prevOverstock.some(prev => prev.productName === alert.productName)
        );
        
        newAlerts.forEach(alert => {
          toast({
            title: "⚠️ Overstock Warning",
            description: `${alert.productName}: ${alert.currentStock} units. Consider reducing next order.`,
          });
        });
      }
    }

    previousAlertsRef.current = alerts;
  }, [alerts]);

  // Show summary notification on mount if there are critical alerts
  useEffect(() => {
    const criticalAlerts = alerts.filter(a => a.type === 'low_stock');
    
    if (criticalAlerts.length > 0) {
      toast({
        title: `⚠️ ${criticalAlerts.length} Critical Alert${criticalAlerts.length > 1 ? 's' : ''}`,
        description: "You have products that need immediate attention. Check the Alerts page for details.",
        variant: "destructive",
      });
    }
  }, []); // Only on mount
};

export default useAlertNotifications;