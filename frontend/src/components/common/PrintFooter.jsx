import { useAuth } from '@/context/AuthContext';

const PrintFooter = ({ className = "" }) => {
    const { user } = useAuth();

    return (
        <div className={`print-footer hidden print:block absolute bottom-1 right-2 text-[10px] text-black font-mono italic leading-none pointer-events-none ${className}`}>
            Printed by: {user?.name || 'User'}
        </div>
    );
};

export default PrintFooter;
