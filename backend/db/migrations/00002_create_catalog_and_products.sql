-- +goose Up
-- Create catalog tables: categories, brands, vehicles, products, compatibilities, user_vehicles

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'package',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    country VARCHAR(50),
    logo_url VARCHAR(255),
    is_oem BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year_from INT NOT NULL,
    year_to INT NOT NULL,
    engine VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL DEFAULT 'GASOLINE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vehicle_spec UNIQUE (make, model, year_from, year_to, engine)
);

CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(model);
CREATE INDEX IF NOT EXISTS idx_vehicles_years ON vehicles(year_from, year_to);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oem_number VARCHAR(100) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    grade VARCHAR(50) NOT NULL DEFAULT 'OEM_GENUINE',
    retail_price BIGINT NOT NULL,
    wholesale_price BIGINT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    warranty_months INT NOT NULL DEFAULT 12,
    image_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_oem ON products(oem_number);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

CREATE TABLE IF NOT EXISTS product_vehicle_compatibilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    position VARCHAR(50),
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_vehicle UNIQUE (product_id, vehicle_id)
);

CREATE INDEX IF NOT EXISTS idx_compat_product ON product_vehicle_compatibilities(product_id);
CREATE INDEX IF NOT EXISTS idx_compat_vehicle ON product_vehicle_compatibilities(vehicle_id);

CREATE TABLE IF NOT EXISTS user_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    engine VARCHAR(50) NOT NULL,
    license_plate VARCHAR(20),
    vin VARCHAR(17),
    nickname VARCHAR(100),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_vehicles_user ON user_vehicles(user_id);

-- Initial seed data for automotive categories
INSERT INTO categories (id, name, slug, code, description, icon_name, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Phụ tùng động cơ & máy', 'phu-tung-dong-co', 'ENG', 'Bugi, cuộn đánh lửa, lọc nhớt, dây curoa, bơm nước', 'Cog', 1),
('c0000000-0000-0000-0000-000000000002', 'Hệ thống phanh & má đĩa', 'he-thong-phanh', 'BRK', 'Má phanh trước sau, đĩa phanh, dầu phanh DOT4, càng phanh', 'Disc', 2),
('c0000000-0000-0000-0000-000000000003', 'Gầm, càng A & giảm xóc', 'gam-giam-xoc', 'SUS', 'Giảm xóc phuộc nhún, rô-tuyn lái, cao su cân bằng, càng A', 'Layers', 3),
('c0000000-0000-0000-0000-000000000004', 'Điện, lốc lạnh & điều hòa', 'dien-dieu-hoa', 'ELE', 'Lốc lạnh máy nén, giàn nóng lạnh, máy phát điện, ắc quy', 'Zap', 4),
('c0000000-0000-0000-0000-000000000005', 'Dầu nhớt, phụ gia & nước làm mát', 'dau-nhot-phu-gia', 'OIL', 'Nhớt tổng hợp toàn phần 0W-20, 5W-30, nước làm mát Prestone', 'Droplet', 5),
('c0000000-0000-0000-0000-000000000006', 'Thân vỏ, đèn & gương chiếu hậu', 'than-vo-den', 'BDY', 'Đèn pha LED, đèn hậu, ba-đờ-sốc cản trước, gương hậu', 'Shield', 6)
ON CONFLICT (slug) DO NOTHING;

-- Initial seed data for major automotive brands
INSERT INTO brands (id, name, slug, country, logo_url, is_oem) VALUES
('b0000000-0000-0000-0000-000000000001', 'Toyota Genuine Parts', 'toyota', 'Japan', '/brands/toyota.svg', TRUE),
('b0000000-0000-0000-0000-000000000002', 'Denso Japan', 'denso', 'Japan', '/brands/denso.svg', TRUE),
('b0000000-0000-0000-0000-000000000003', 'Bosch Germany', 'bosch', 'Germany', '/brands/bosch.svg', TRUE),
('b0000000-0000-0000-0000-000000000004', 'Brembo Italy', 'brembo', 'Italy', '/brands/brembo.svg', FALSE),
('b0000000-0000-0000-0000-000000000005', 'Aisin Japan', 'aisin', 'Japan', '/brands/aisin.svg', TRUE),
('b0000000-0000-0000-0000-000000000006', 'Hyundai Mobis', 'mobis', 'Korea', '/brands/mobis.svg', TRUE),
('b0000000-0000-0000-0000-000000000007', 'NGK Spark Plugs', 'ngk', 'Japan', '/brands/ngk.svg', TRUE),
('b0000000-0000-0000-0000-000000000008', 'Motul France', 'motul', 'France', '/brands/motul.svg', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- Initial seed data for popular vehicles in Vietnam (UUID prefix a0000000)
INSERT INTO vehicles (id, make, model, year_from, year_to, engine, fuel_type) VALUES
('a0000000-0000-0000-0000-000000000001', 'Toyota', 'Vios', 2018, 2023, '1.5L 2NR-FE (Xăng)', 'GASOLINE'),
('a0000000-0000-0000-0000-000000000002', 'Toyota', 'Corolla Cross', 2020, 2024, '1.8L 2ZR-FE / Hybrid', 'HYBRID'),
('a0000000-0000-0000-0000-000000000003', 'Honda', 'City', 2020, 2024, '1.5L L15B DOHC i-VTEC', 'GASOLINE'),
('a0000000-0000-0000-0000-000000000004', 'Honda', 'CR-V', 2018, 2023, '1.5L VTEC Turbo L15BG', 'GASOLINE'),
('a0000000-0000-0000-0000-000000000005', 'Mazda', 'Mazda 3', 2019, 2024, '1.5L SkyActiv-G', 'GASOLINE'),
('a0000000-0000-0000-0000-000000000006', 'Ford', 'Ranger', 2018, 2023, '2.0L Bi-Turbo Diesel', 'DIESEL'),
('a0000000-0000-0000-0000-000000000007', 'Hyundai', 'Accent', 2018, 2023, '1.4L Kappa MPI', 'GASOLINE'),
('a0000000-0000-0000-0000-000000000008', 'Mitsubishi', 'Xpander', 2018, 2024, '1.5L MIVEC 4A91', 'GASOLINE')
ON CONFLICT (make, model, year_from, year_to, engine) DO NOTHING;

-- Initial seed data for key automotive parts (UUID prefix d0000000)
INSERT INTO products (id, oem_number, sku, name, slug, brand_id, category_id, grade, retail_price, wholesale_price, stock_quantity, warranty_months, description) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    '04465-0D150',
    'BRK-DEN-04465',
    'Bộ Má Phanh Trước Denso Japan Chuẩn OEM',
    'bo-ma-phanh-truoc-denso-japan-04465-0d150',
    'b0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'OEM_GENUINE',
    450000,
    370000,
    45,
    12,
    'Má phanh trước Denso Japan bằng hợp chất gốm ceramic cao cấp, êm ái không gây xước đĩa, giảm bụi phanh tối đa.'
),
(
    'd0000000-0000-0000-0000-000000000002',
    '90919-01253',
    'ENG-DEN-SC20HR11',
    'Bugi Iridium Chân Dài Denso SC20HR11',
    'bugi-iridium-chan-dai-denso-sc20hr11',
    'b0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'OEM_GENUINE',
    220000,
    175000,
    120,
    24,
    'Bugi Iridium cao cấp độ bền 100.000km, đánh lửa cực nhạy, tiết kiệm nhiên liệu và ổn định vòng tua.'
),
(
    'd0000000-0000-0000-0000-000000000003',
    '0986-AF3-018',
    'ENG-BOS-AF3018',
    'Lọc Gió Động Cơ Bosch High-Flow Chống Ẩm',
    'loc-gio-dong-co-bosch-high-flow',
    'b0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'AFTERMARKET_PREMIUM',
    180000,
    135000,
    80,
    6,
    'Màng lọc vi sợi tổng hợp ngăn chặn 99.5% bụi mịn lọt vào buồng đốt buồng máy.'
),
(
    'd0000000-0000-0000-0000-000000000004',
    '48510-0D590',
    'SUS-KYB-333338',
    'Cặp Phuộc Nhún Giảm Xóc Trước KYB Excel-G Gas',
    'cap-phuoc-nhun-giam-xoc-truoc-kyb-excel-g',
    'b0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'OEM_GENUINE',
    1650000,
    1380000,
    24,
    12,
    'Phuộc nhún dầu kết hợp khí gas nitơ nén áp suất cao dập tắt dao động nhanh chóng, triệt tiêu bồng bềnh.'
),
(
    'd0000000-0000-0000-0000-000000000005',
    '08880-83389',
    'OIL-MOT-8100-5W30',
    'Dầu Động Cơ Motul 8100 X-cess Gen2 5W-40 (4L)',
    'dau-dong-co-motul-8100-xcess-gen2-5w40-4l',
    'b0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000005',
    'AFTERMARKET_PREMIUM',
    950000,
    780000,
    60,
    6,
    'Dầu tổng hợp 100% gốc Ester cao cấp bảo vệ buồng đốt và hệ thống cam xích trong điều kiện vận hành khắc nghiệt.'
),
(
    'd0000000-0000-0000-0000-000000000006',
    '88310-0D330',
    'ELE-DEN-10S11C',
    'Lốc Lạnh Máy Nén Điều Hòa Denso 10S11C Chuẩn Hãng',
    'loc-lanh-may-nen-dieu-hoa-denso-10s11c',
    'b0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000004',
    'OEM_GENUINE',
    4850000,
    4100000,
    12,
    18,
    'Lốc điều hòa Denso nguyên đai nguyên kiện làm mát cực sâu, vận hành êm ái và siêu bền bỉ.'
)
ON CONFLICT (sku) DO NOTHING;

-- Map product compatibilities to vehicles
INSERT INTO product_vehicle_compatibilities (product_id, vehicle_id, position, notes) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'FRONT', 'Khớp hoàn toàn Vios 2018-2023'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'ENGINE', 'Bugi cho động cơ 1.5L 2NR-FE'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'ENGINE', 'Bugi cho động cơ 1.8L 2ZR-FE'),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ENGINE', 'Lọc gió khoang máy'),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'FRONT', 'Cặp phuộc trước bên lái và phụ'),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'FRONT', 'Lốc máy nén gas R134a')
ON CONFLICT ON CONSTRAINT uq_product_vehicle DO NOTHING;

-- +goose Down
DROP TABLE IF EXISTS user_vehicles;
DROP TABLE IF EXISTS product_vehicle_compatibilities;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
