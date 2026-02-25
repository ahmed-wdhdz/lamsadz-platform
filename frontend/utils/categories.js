
import { LayoutTemplate, Armchair, BedDouble, Table2, Library, Package } from 'lucide-react';

export const categories = [
    {
        value: 'Kitchen',
        label: 'أثاث مطبخ',
        labelEn: 'Kitchen Furniture',
        icon: LayoutTemplate,
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=600'
    },
    {
        value: 'Sofa',
        label: 'أريكة',
        labelEn: 'Sofa',
        icon: Armchair,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600'
    },
    {
        value: 'Bed',
        label: 'غرفة نوم',
        labelEn: 'Bedroom',
        icon: BedDouble,
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600'
    },
    {
        value: 'Table',
        label: 'طاولة',
        labelEn: 'Table',
        icon: Table2,
        image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=600'
    },
    {
        value: 'Cabinet',
        label: 'خزانة',
        labelEn: 'Cabinet',
        icon: Library,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600'
    },
    {
        value: 'Other',
        label: 'آخر',
        labelEn: 'Other',
        icon: Package,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600'
    }
];
