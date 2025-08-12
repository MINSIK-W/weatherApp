import {
    Sun,
    Cloud,
    CloudDrizzle,
    Droplets,
    CloudRain,
    Snowflake,
    Wind
} from 'lucide-react';

const weatherConfig = {
    clear:{
        icon: Sun,
        defaultColor: 'text-yellow-500'
    },
    cloud: {
        icon: Cloud,
        defaultColor: 'text-gray-500'
    },
    drizzle: {
        icon: CloudDrizzle,
        defaultColor: 'text-blue-300'
    },
    humidity: {
        icon: Droplets,
        defaultColor: 'text-blue-400'
    },
    rain: {
        icon: CloudRain,
        defaultColor: 'text-blue-600'
    },
    snow: {
        icon: Snowflake,
        defaultColor: 'text-gray-200'
    },
    wind: {
        icon: Wind,
        defaultColor: 'text-gray-400'
    }
};

interface WeatherIconProps {
    weather: 'clear' | 'cloud' | 'drizzle' | 'humidity' | 'rain' | 'snow' | 'wind';
    size?: number;
    className?: string;
    useDefaultColor?: boolean;
}

export default function WeatherIcon({ weather, size = 24, className = "", useDefaultColor = true  }: WeatherIconProps) {
    if (!weather) {
        console.warn('WeatherIcon: 잘못된 prop');
        return <Sun size={size} className={className} />;
    }

    const normalizedWeather = weather.toLowerCase() as keyof typeof weatherConfig;
    const config = weatherConfig[normalizedWeather] || weatherConfig.clear;

    // 기본 색상 사용 여부에 따라 className 결정
    const finalClassName = useDefaultColor && !className
        ? config.defaultColor
        : className || config.defaultColor;

    return (
        <config.icon
            size={size}
            className={finalClassName}
        />
    );
}