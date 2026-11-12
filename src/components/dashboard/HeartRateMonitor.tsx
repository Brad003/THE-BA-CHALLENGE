import React, { useState, useEffect } from 'react';
import { HeartPulse, Bluetooth, Activity, BluetoothConnected, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeartRateMonitor: React.FC = () => {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectDevice = async () => {
    if (!navigator.bluetooth) {
      setError('Web Bluetooth API is not supported in this browser.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['heart_rate']
      });

      btDevice.addEventListener('gattserverdisconnected', handleDisconnect);
      
      const server = await btDevice.gatt?.connect();
      const service = await server?.getPrimaryService('heart_rate');
      const characteristic = await service?.getCharacteristic('heart_rate_measurement');
      
      await characteristic?.startNotifications();
      characteristic?.addEventListener('characteristicvaluechanged', handleHeartRateChange);
      
      setDevice(btDevice);
      setIsConnecting(false);
    } catch (err: any) {
      console.error(err);
      if (err.name === 'NotFoundError') {
        setError('No device selected.');
      } else {
        setError(err.message || 'Failed to connect to device.');
      }
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setDevice(null);
    setHeartRate(null);
  };

  const disconnectDevice = () => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    handleDisconnect();
  };

  const handleHeartRateChange = (event: any) => {
    const value = event.target.value;
    // The first byte contains flags
    const flags = value.getUint8(0);
    // 0th bit indicates Heart Rate Value Format (0 = 8-bit, 1 = 16-bit)
    const rate16Bits = flags & 0x1;
    
    let currentHeartRate;
    if (rate16Bits) {
      currentHeartRate = value.getUint16(1, true); // true for little-endian
    } else {
      currentHeartRate = value.getUint8(1);
    }
    
    setHeartRate(currentHeartRate);
  };

  // Determine intensity zone
  let zoneColor = '#7d9987';
  let zoneText = 'RESTING';
  
  if (heartRate) {
    if (heartRate < 100) {
      zoneColor = '#34d399'; // Emerald
      zoneText = 'WARM UP';
    } else if (heartRate < 140) {
      zoneColor = '#60a5fa'; // Blue
      zoneText = 'AEROBIC';
    } else if (heartRate < 170) {
      zoneColor = '#f59e0b'; // Amber
      zoneText = 'ANAEROBIC';
    } else {
      zoneColor = '#ef4444'; // Red
      zoneText = 'VO2 MAX';
    }
  }

  return (
    <div className="p-5 rounded-3xl bg-[#0a150e] border border-[#1b3826] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-4 h-4 text-[#ef4444]" />
          <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
            LIVE INTENSITY METRICS
          </h3>
        </div>
        
        {device ? (
          <button 
            onClick={disconnectDevice}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#14261b] hover:bg-[#1a3324] border border-[#23462f] text-xs font-semibold text-[#8ea496] transition-colors"
          >
            <BluetoothConnected className="w-3 h-3 text-[#34d399]" />
            <span>{device.name || 'Connected'}</span>
            <X className="w-3 h-3 ml-1 text-[#ef4444]" />
          </button>
        ) : (
          <button 
            onClick={connectDevice}
            disabled={isConnecting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-main)]/10 hover:bg-[var(--accent-main)]/20 border border-[var(--accent-main)]/30 text-xs font-semibold text-[var(--accent-main)] transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <Bluetooth className="w-3 h-3" />
                <span>Pair Wearable</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        {error && (
          <p className="text-xs text-[#ef4444] mb-4 text-center max-w-sm">{error}</p>
        )}

        {!device ? (
          <div className="flex flex-col items-center space-y-3 opacity-50">
            <Activity className="w-12 h-12 text-[#5c7566]" />
            <p className="text-xs text-[#5c7566] text-center">
              Connect a Bluetooth heart rate monitor <br/> to track live intensity.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Pulse ring animation */}
              <AnimatePresence>
                {heartRate && (
                  <motion.div
                    key="pulse"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: heartRate ? 60 / heartRate : 1,
                      ease: "easeOut" 
                    }}
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: zoneColor }}
                  />
                )}
              </AnimatePresence>
              
              <div 
                className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center bg-[#0d1c13] shadow-lg relative z-10 transition-colors duration-1000"
                style={{ borderColor: zoneColor }}
              >
                <span className="text-4xl font-black text-[#f5ebd7]">
                  {heartRate || '--'}
                </span>
                <span className="text-xs font-bold" style={{ color: zoneColor }}>
                  BPM
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#8ea496] tracking-widest uppercase mb-1">
                CURRENT ZONE
              </span>
              <span 
                className="text-sm font-black tracking-widest uppercase transition-colors duration-1000 px-3 py-1 rounded bg-[#112417] border border-[#23462f]"
                style={{ color: zoneColor }}
              >
                {zoneText}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
