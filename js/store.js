(function () {
    const K = {
        session: 'goalzone_session',
        fields: 'goalzone_fields',
        customers: 'goalzone_customers',
        bookings: 'goalzone_bookings',
        admin: 'goalzone_admin'
    };

    const ADMIN = {
        username: 'adm_dungcris',
        password: 'TSD@2026ADM',
        name: 'Dũngcris ADM',
        role: 'Quản lý ADM',
        recoveryKey: 'DUNGCRIS2026'
    };

    const LABELS = {
        fieldStatus: {
            available: 'Sẵn sàng',
            maintenance: 'Bảo trì',
            inactive: 'Tạm ẩn'
        },
        customerStatus: {
            active: 'Đang hoạt động',
            inactive: 'Tạm ngưng'
        },
        customerLevel: {
            standard: 'Khách lẻ',
            vip: 'VIP',
            team: 'Đội bóng'
        },
        bookingStatus: {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            completed: 'Đã chơi',
            cancelled: 'Đã hủy'
        },
        payment: {
            unpaid: 'Chưa thanh toán',
            deposit: 'Đã cọc',
            paid: 'Đã thanh toán',
            refunded: 'Hoàn tiền'
        }
    };

    const SEED = {
        fields: [
            {
                id: 'fld-a1',
                name: 'Sân A1',
                code: 'A1',
                type: 'Sân 5',
                surface: 'Cỏ nhân tạo',
                hourlyRate: 350000,
                capacity: 10,
                status: 'available',
                location: 'Khu A',
                amenities: 'Đèn LED, phòng thay đồ, nước nóng',
                notes: 'Phù hợp thi đấu buổi tối và giải nội bộ.',
                createdAt: '2026-03-10T08:00:00+07:00'
            },
            {
                id: 'fld-b2',
                name: 'Sân B2',
                code: 'B2',
                type: 'Sân 7',
                surface: 'Cỏ nhân tạo',
                hourlyRate: 520000,
                capacity: 14,
                status: 'available',
                location: 'Khu B',
                amenities: 'Khán đài mini, bảng tỷ số, wifi',
                notes: 'Khung giờ 17:00 - 21:00 thường kín lịch.',
                createdAt: '2026-03-11T09:15:00+07:00'
            },
            {
                id: 'fld-c1',
                name: 'Sân C1',
                code: 'C1',
                type: 'Sân 11',
                surface: 'Cỏ lai',
                hourlyRate: 950000,
                capacity: 22,
                status: 'maintenance',
                location: 'Khu C',
                amenities: 'Phòng trọng tài, khu gửi xe rộng',
                notes: 'Đang bảo dưỡng mặt sân đến cuối tuần.',
                createdAt: '2026-03-12T07:30:00+07:00'
            }
        ],
        customers: [
            {
                id: 'cus-hung',
                name: 'Nguyễn Quốc Hưng',
                phone: '0901234567',
                email: 'quochung@email.com',
                teamName: 'FC Gò Vấp',
                level: 'team',
                status: 'active',
                notes: 'Thường đặt tối thứ 3 và thứ 5.',
                createdAt: '2026-03-10T10:00:00+07:00'
            },
            {
                id: 'cus-an',
                name: 'Lê Hoàng An',
                phone: '0912345678',
                email: 'hoangan@email.com',
                teamName: '',
                level: 'vip',
                status: 'active',
                notes: 'Ưu tiên sân có phòng thay đồ riêng.',
                createdAt: '2026-03-11T14:30:00+07:00'
            },
            {
                id: 'cus-minh',
                name: 'Trần Khánh Minh',
                phone: '0988777666',
                email: 'khanhminh@email.com',
                teamName: 'Minh Brothers',
                level: 'standard',
                status: 'active',
                notes: 'Hay thuê thêm áo bib và bóng thi đấu.',
                createdAt: '2026-03-13T09:45:00+07:00'
            }
        ],
        bookings: [
            {
                id: 'bok-1',
                code: 'DS20260325-001',
                fieldId: 'fld-a1',
                fieldName: 'Sân A1',
                fieldCode: 'A1',
                fieldType: 'Sân 5',
                customerId: 'cus-hung',
                customerName: 'Nguyễn Quốc Hưng',
                customerPhone: '0901234567',
                bookingDate: '2026-03-25',
                startTime: '18:00',
                endTime: '19:30',
                durationHours: 1.5,
                hourlyRate: 350000,
                status: 'confirmed',
                paymentStatus: 'deposit',
                notes: 'Giữ sân gần khu thay đồ.',
                addons: [
                    { id: 'add-1', name: 'Áo bib', price: 120000 }
                ],
                addonTotal: 120000,
                total: 645000,
                createdAt: '2026-03-20T09:00:00+07:00'
            },
            {
                id: 'bok-2',
                code: 'DS20260326-001',
                fieldId: 'fld-b2',
                fieldName: 'Sân B2',
                fieldCode: 'B2',
                fieldType: 'Sân 7',
                customerId: 'cus-an',
                customerName: 'Lê Hoàng An',
                customerPhone: '0912345678',
                bookingDate: '2026-03-26',
                startTime: '19:00',
                endTime: '21:00',
                durationHours: 2,
                hourlyRate: 520000,
                status: 'pending',
                paymentStatus: 'unpaid',
                notes: 'Chờ xác nhận đội hình đủ người.',
                addons: [
                    { id: 'add-2', name: 'Nước suối', price: 80000 }
                ],
                addonTotal: 80000,
                total: 1120000,
                createdAt: '2026-03-22T16:20:00+07:00'
            },
            {
                id: 'bok-3',
                code: 'DS20260323-001',
                fieldId: 'fld-a1',
                fieldName: 'Sân A1',
                fieldCode: 'A1',
                fieldType: 'Sân 5',
                customerId: 'cus-minh',
                customerName: 'Trần Khánh Minh',
                customerPhone: '0988777666',
                bookingDate: '2026-03-23',
                startTime: '20:00',
                endTime: '21:30',
                durationHours: 1.5,
                hourlyRate: 350000,
                status: 'completed',
                paymentStatus: 'paid',
                notes: 'Đội thi đấu giao hữu cuối tuần.',
                addons: [
                    { id: 'add-3', name: 'Thuê bóng thi đấu', price: 100000 },
                    { id: 'add-4', name: 'Khăn lạnh', price: 50000 }
                ],
                addonTotal: 150000,
                total: 675000,
                createdAt: '2026-03-18T11:10:00+07:00'
            }
        ]
    };

    const clone = function (value) {
        return JSON.parse(JSON.stringify(value));
    };

    const read = function (key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : clone(fallback);
        } catch (error) {
            return clone(fallback);
        }
    };

    const write = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const adminAccount = function () {
        const saved = read(K.admin, {});
        return {
            username: String(saved.username || ADMIN.username).trim() || ADMIN.username,
            password: String(saved.password || ADMIN.password),
            name: ADMIN.name,
            role: ADMIN.role,
            recoveryKey: String(saved.recoveryKey || ADMIN.recoveryKey).trim() || ADMIN.recoveryKey
        };
    };

    const normalizeSession = function (session) {
        if (!session || !session.loggedIn) return session;
        const admin = adminAccount();
        return {
            ...session,
            username: admin.username,
            name: admin.name,
            role: admin.role
        };
    };

    const emit = function (type) {
        window.dispatchEvent(new CustomEvent('store:updated', {
            detail: {
                type: type,
                time: Date.now()
            }
        }));
    };

    const uid = function (prefix) {
        return prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    };

    const esc = function (value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const money = function (value) {
        return new Intl.NumberFormat('vi-VN').format(Math.round(Number(value) || 0)) + ' VNĐ';
    };

    const hoursText = function (value) {
        const hours = Math.round((Number(value) || 0) * 10) / 10;
        const text = Math.abs(hours - Math.round(hours)) < 0.001 ? String(Math.round(hours)) : String(hours);
        return text + ' giờ';
    };

    const dateText = function (value, withTime) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        const options = withTime
            ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
            : { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleString('vi-VN', options);
    };

    const todayKey = function () {
        const now = new Date();
        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
    };

    const combineDateTime = function (date, time) {
        if (!date || !time) return new Date('invalid');
        return new Date(date + 'T' + time + ':00');
    };

    const timeToMinutes = function (value) {
        const parts = String(value || '').split(':');
        if (parts.length !== 2) return NaN;
        return (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
    };

    const durationHours = function (startTime, endTime) {
        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);
        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
        return Math.round(((end - start) / 60) * 100) / 100;
    };

    const addonTotal = function (booking) {
        return (booking.addons || []).reduce(function (sum, item) {
            return sum + Math.max(0, Number(item.price) || 0);
        }, 0);
    };

    const bookingTotal = function (booking) {
        return Math.max(0, Number(booking.hourlyRate) || 0) * Math.max(0, Number(booking.durationHours) || 0) + addonTotal(booking);
    };

    const compareUpcoming = function (a, b) {
        return combineDateTime(a.bookingDate, a.startTime) - combineDateTime(b.bookingDate, b.startTime);
    };

    const compareRecent = function (a, b) {
        return combineDateTime(b.bookingDate, b.startTime) - combineDateTime(a.bookingDate, a.startTime);
    };

    function init() {
        if (window.__goalZoneReady) return;

        if (!localStorage.getItem(K.admin)) write(K.admin, adminAccount());
        if (!localStorage.getItem(K.fields)) write(K.fields, SEED.fields);
        if (!localStorage.getItem(K.customers)) write(K.customers, SEED.customers);
        if (!localStorage.getItem(K.bookings)) write(K.bookings, SEED.bookings);

        if (!localStorage.getItem(K.session) && localStorage.getItem('isLoggedIn') === 'true') {
            const admin = adminAccount();
            write(K.session, {
                loggedIn: true,
                username: localStorage.getItem('username') || admin.username,
                name: admin.name,
                role: admin.role,
                loginAt: new Date().toISOString()
            });
        }

        const session = read(K.session, null);
        const normalized = normalizeSession(session);
        if (normalized && JSON.stringify(normalized) !== JSON.stringify(session)) {
            write(K.session, normalized);
        }

        window.__goalZoneReady = true;
    }

    const rawFields = function () {
        init();
        return read(K.fields, []);
    };

    const rawCustomers = function () {
        init();
        return read(K.customers, []);
    };

    const rawBookings = function () {
        init();
        return read(K.bookings, []);
    };

    function bookings() {
        const fieldMap = new Map(rawFields().map(function (field) {
            return [field.id, field];
        }));
        const customerMap = new Map(rawCustomers().map(function (customer) {
            return [customer.id, customer];
        }));

        return rawBookings().map(function (booking) {
            const field = fieldMap.get(booking.fieldId) || {};
            const customer = customerMap.get(booking.customerId) || {};
            const duration = Number(booking.durationHours) || durationHours(booking.startTime, booking.endTime);
            const addons = (booking.addons || []).map(function (item) {
                return {
                    id: item.id || uid('addon'),
                    name: String(item.name || '').trim(),
                    price: Math.max(0, Number(item.price) || 0)
                };
            });

            return {
                ...booking,
                fieldName: booking.fieldName || field.name || 'Sân bóng',
                fieldCode: booking.fieldCode || field.code || '',
                fieldType: booking.fieldType || field.type || '',
                customerName: booking.customerName || customer.name || 'Khách hàng',
                customerPhone: booking.customerPhone || customer.phone || '',
                hourlyRate: Math.max(0, Number(booking.hourlyRate || field.hourlyRate) || 0),
                durationHours: duration,
                addons: addons,
                addonTotal: addonTotal({ addons: addons }),
                total: bookingTotal({
                    hourlyRate: booking.hourlyRate || field.hourlyRate || 0,
                    durationHours: duration,
                    addons: addons
                })
            };
        }).sort(compareRecent);
    }

    function customers() {
        const allBookings = bookings();
        return rawCustomers().map(function (customer) {
            const ownBookings = allBookings.filter(function (booking) {
                return booking.customerId === customer.id && booking.status !== 'cancelled';
            });
            const recentBooking = ownBookings.slice().sort(compareRecent)[0] || null;

            return {
                ...customer,
                bookingCount: ownBookings.length,
                totalSpent: ownBookings.reduce(function (sum, booking) {
                    return sum + booking.total;
                }, 0),
                lastBookingAt: recentBooking
                    ? recentBooking.bookingDate + 'T' + recentBooking.startTime + ':00'
                    : ''
            };
        }).sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    function fields() {
        const now = new Date();
        const allBookings = bookings();

        return rawFields().map(function (field) {
            const ownBookings = allBookings.filter(function (booking) {
                return booking.fieldId === field.id && booking.status !== 'cancelled';
            });
            const futureBooking = ownBookings
                .filter(function (booking) {
                    return combineDateTime(booking.bookingDate, booking.startTime) >= now && booking.status !== 'completed';
                })
                .sort(compareUpcoming)[0];

            return {
                ...field,
                bookingCount: ownBookings.length,
                bookedHours: ownBookings.reduce(function (sum, booking) {
                    return sum + booking.durationHours;
                }, 0),
                revenue: ownBookings.reduce(function (sum, booking) {
                    return sum + booking.total;
                }, 0),
                nextBookingAt: futureBooking ? futureBooking.bookingDate + 'T' + futureBooking.startTime + ':00' : ''
            };
        }).sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    function login(username, password) {
        init();
        const admin = adminAccount();
        if (username !== admin.username || password !== admin.password) {
            return {
                ok: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng.'
            };
        }

        const session = {
            loggedIn: true,
            username: admin.username,
            name: admin.name,
            role: admin.role,
            loginAt: new Date().toISOString()
        };

        write(K.session, session);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', admin.username);

        return {
            ok: true,
            session: session
        };
    }

    function resetAdminPassword(input) {
        init();
        const admin = adminAccount();
        const username = String(input.username || '').trim();
        const recoveryKey = String(input.recoveryKey || '').trim();
        const newPassword = String(input.newPassword || '').trim();
        const confirmPassword = String(input.confirmPassword || '').trim();

        if (!username || !recoveryKey || !newPassword || !confirmPassword) {
            return {
                ok: false,
                message: 'Vui lòng nhập đầy đủ thông tin.'
            };
        }

        if (username !== admin.username) {
            return {
                ok: false,
                message: 'Tên đăng nhập không đúng.'
            };
        }

        if (recoveryKey !== admin.recoveryKey) {
            return {
                ok: false,
                message: 'Mã khôi phục không đúng.'
            };
        }

        if (newPassword.length < 6) {
            return {
                ok: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự.'
            };
        }

        if (newPassword !== confirmPassword) {
            return {
                ok: false,
                message: 'Mật khẩu nhập lại chưa khớp.'
            };
        }

        write(K.admin, {
            ...admin,
            password: newPassword,
            updatedAt: new Date().toISOString()
        });

        return {
            ok: true,
            message: 'Đã tạo mật khẩu mới.'
        };
    }

    function logout() {
        localStorage.removeItem(K.session);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    }

    function currentAdmin() {
        return normalizeSession(read(K.session, null));
    }

    function requireAuth() {
        init();
        if (!currentAdmin() || !currentAdmin().loggedIn) {
            window.location.href = 'dangnhap.html';
        }
    }

    function redirectIfAuthenticated() {
        init();
        if (currentAdmin() && currentAdmin().loggedIn) {
            window.location.href = 'trangchu.html';
        }
    }

    function saveField(input) {
        const list = rawFields();
        const item = {
            id: input.id || uid('field'),
            name: String(input.name || '').trim(),
            code: String(input.code || '').trim().toUpperCase(),
            type: String(input.type || '').trim(),
            surface: String(input.surface || '').trim(),
            hourlyRate: Math.max(0, Number(input.hourlyRate) || 0),
            capacity: Math.max(0, Number(input.capacity) || 0),
            status: input.status || 'available',
            location: String(input.location || '').trim(),
            amenities: String(input.amenities || '').trim(),
            notes: String(input.notes || '').trim(),
            createdAt: input.createdAt || new Date().toISOString()
        };

        if (!item.name || !item.code || !item.type) {
            throw new Error('Tên sân, mã sân và loại sân là bắt buộc.');
        }

        if (list.some(function (field) {
            return field.code.toLowerCase() === item.code.toLowerCase() && field.id !== item.id;
        })) {
            throw new Error('Mã sân đã tồn tại.');
        }

        const index = list.findIndex(function (field) {
            return field.id === item.id;
        });

        if (index >= 0) {
            item.createdAt = list[index].createdAt;
            list[index] = item;
        } else {
            list.unshift(item);
        }

        write(K.fields, list);
        emit('fields');
        return item;
    }

    function saveCustomer(input) {
        const list = rawCustomers();
        const item = {
            id: input.id || uid('customer'),
            name: String(input.name || '').trim(),
            phone: String(input.phone || '').trim(),
            email: String(input.email || '').trim(),
            teamName: String(input.teamName || '').trim(),
            level: String(input.level || 'standard').trim(),
            status: input.status || 'active',
            notes: String(input.notes || '').trim(),
            createdAt: input.createdAt || new Date().toISOString()
        };

        if (!item.name || !item.phone) {
            throw new Error('Họ tên và số điện thoại là bắt buộc.');
        }

        const index = list.findIndex(function (customer) {
            return customer.id === item.id;
        });

        if (index >= 0) {
            item.createdAt = list[index].createdAt;
            list[index] = item;
        } else {
            list.unshift(item);
        }

        write(K.customers, list);
        emit('customers');
        return item;
    }

    function savePublicCustomer(input) {
        const list = rawCustomers();
        const phone = String(input.phone || '').trim();
        const name = String(input.name || '').trim();
        const email = String(input.email || '').trim();
        const teamName = String(input.teamName || '').trim();
        const notes = String(input.notes || '').trim();

        if (!name || !phone) {
            throw new Error('Vui lòng nhập họ tên và số điện thoại để đặt sân.');
        }

        const foundIndex = list.findIndex(function (customer) {
            return String(customer.phone || '').trim() === phone;
        });

        if (foundIndex >= 0) {
            const current = list[foundIndex];
            const updated = {
                ...current,
                name: name || current.name,
                phone: phone,
                email: email || current.email || '',
                teamName: teamName || current.teamName || '',
                notes: notes || current.notes || '',
                status: 'active'
            };

            list[foundIndex] = updated;
            write(K.customers, list);
            emit('customers');
            return updated;
        }

        const item = {
            id: uid('customer'),
            name: name,
            phone: phone,
            email: email,
            teamName: teamName,
            level: 'standard',
            status: 'active',
            notes: notes,
            createdAt: new Date().toISOString()
        };

        list.unshift(item);
        write(K.customers, list);
        emit('customers');
        return item;
    }

    function validateBookingConflict(item, currentId) {
        if (item.status === 'cancelled') return;

        const conflicts = rawBookings().some(function (booking) {
            if (booking.id === currentId) return false;
            if (booking.fieldId !== item.fieldId) return false;
            if (booking.bookingDate !== item.bookingDate) return false;
            if (booking.status === 'cancelled') return false;

            const start = timeToMinutes(item.startTime);
            const end = timeToMinutes(item.endTime);
            const otherStart = timeToMinutes(booking.startTime);
            const otherEnd = timeToMinutes(booking.endTime);

            return Math.max(start, otherStart) < Math.min(end, otherEnd);
        });

        if (conflicts) {
            throw new Error('Khung giờ này đã có lịch trên sân được chọn.');
        }
    }

    function makeBookingCode(list, bookingDate) {
        const prefix = 'DS' + String(bookingDate || todayKey()).replace(/-/g, '');
        const serial = list.filter(function (item) {
            return String(item.code || '').indexOf(prefix) === 0;
        }).length + 1;
        return prefix + '-' + String(serial).padStart(3, '0');
    }

    function saveBooking(input) {
        const list = rawBookings();
        const field = rawFields().find(function (entry) {
            return entry.id === input.fieldId;
        });
        const customer = rawCustomers().find(function (entry) {
            return entry.id === input.customerId;
        });
        const startTime = String(input.startTime || '').trim();
        const endTime = String(input.endTime || '').trim();
        const bookingDate = String(input.bookingDate || '').trim();
        const duration = durationHours(startTime, endTime);

        if (!field) throw new Error('Vui lòng chọn sân bóng.');
        if (!customer) throw new Error('Vui lòng chọn khách hàng.');
        if (!bookingDate || !startTime || !endTime) throw new Error('Vui lòng nhập ngày và khung giờ đặt sân.');
        if (duration <= 0) throw new Error('Giờ kết thúc phải lớn hơn giờ bắt đầu.');
        if (field.status !== 'available' && input.status !== 'cancelled') throw new Error('Sân đang bảo trì hoặc tạm ẩn, không thể nhận lịch mới.');

        const addons = (input.addons || []).map(function (item) {
            return {
                id: item.id || uid('addon'),
                name: String(item.name || '').trim(),
                price: Math.max(0, Number(item.price) || 0)
            };
        }).filter(function (item) {
            return item.name && item.price >= 0;
        });

        const item = {
            id: input.id || uid('booking'),
            code: input.code || makeBookingCode(list, bookingDate),
            fieldId: field.id,
            fieldName: field.name,
            fieldCode: field.code,
            fieldType: field.type,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            durationHours: duration,
            hourlyRate: field.hourlyRate,
            status: input.status || 'pending',
            paymentStatus: input.paymentStatus || 'unpaid',
            notes: String(input.notes || '').trim(),
            addons: addons,
            addonTotal: addonTotal({ addons: addons }),
            total: bookingTotal({
                hourlyRate: field.hourlyRate,
                durationHours: duration,
                addons: addons
            }),
            createdAt: input.createdAt || new Date().toISOString()
        };

        validateBookingConflict(item, item.id);

        const index = list.findIndex(function (booking) {
            return booking.id === item.id;
        });

        if (index >= 0) {
            item.code = list[index].code;
            item.createdAt = list[index].createdAt;
            list[index] = item;
        } else {
            list.unshift(item);
        }

        write(K.bookings, list);
        emit('bookings');
        return item;
    }

    function savePublicBooking(input) {
        const field = rawFields().find(function (entry) {
            return entry.id === input.fieldId;
        });
        const bookingDate = String(input.bookingDate || '').trim();
        const startTime = String(input.startTime || '').trim();
        const endTime = String(input.endTime || '').trim();
        const duration = durationHours(startTime, endTime);

        if (!field) throw new Error('Vui lòng chọn sân bóng.');
        if (!bookingDate || !startTime || !endTime) throw new Error('Vui lòng nhập ngày và khung giờ muốn thuê.');
        if (duration <= 0) throw new Error('Giờ kết thúc phải lớn hơn giờ bắt đầu.');
        if (field.status !== 'available') throw new Error('Sân này hiện chưa thể nhận lịch mới.');

        validateBookingConflict({
            id: '',
            fieldId: field.id,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            status: 'pending'
        }, '');

        const customer = savePublicCustomer({
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail,
            teamName: input.customerTeamName,
            notes: input.customerNotes
        });

        return saveBooking({
            customerId: customer.id,
            fieldId: field.id,
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime,
            status: 'pending',
            paymentStatus: 'unpaid',
            notes: String(input.notes || '').trim(),
            addons: []
        });
    }

    function removeField(id) {
        if (rawBookings().some(function (booking) { return booking.fieldId === id; })) {
            throw new Error('Không thể xóa sân đã phát sinh lịch đặt.');
        }
        write(K.fields, rawFields().filter(function (field) { return field.id !== id; }));
        emit('fields');
    }

    function removeCustomer(id) {
        if (rawBookings().some(function (booking) { return booking.customerId === id; })) {
            throw new Error('Không thể xóa khách hàng đã có lịch đặt.');
        }
        write(K.customers, rawCustomers().filter(function (customer) { return customer.id !== id; }));
        emit('customers');
    }

    function removeBooking(id) {
        write(K.bookings, rawBookings().filter(function (booking) { return booking.id !== id; }));
        emit('bookings');
    }

    function analytics() {
        const allFields = fields();
        const allCustomers = customers();
        const allBookings = bookings();
        const activeBookings = allBookings.filter(function (booking) {
            return booking.status !== 'cancelled';
        });
        const today = todayKey();
        const now = new Date();
        const months = {};
        const types = Array.from(new Set(allFields.map(function (field) {
            return field.type;
        }))).sort(function (a, b) {
            return a.localeCompare(b, 'vi');
        });

        activeBookings.forEach(function (booking) {
            const key = String(booking.bookingDate || '').slice(0, 7);
            if (!key) return;
            if (!months[key]) {
                months[key] = {
                    month: key,
                    label: 'Tháng ' + key.slice(5, 7) + '/' + key.slice(0, 4),
                    revenue: 0
                };
            }
            months[key].revenue += booking.total;
        });

        return {
            expectedRevenue: activeBookings.reduce(function (sum, booking) {
                return sum + booking.total;
            }, 0),
            collectedRevenue: activeBookings.filter(function (booking) {
                return booking.paymentStatus === 'paid';
            }).reduce(function (sum, booking) {
                return sum + booking.total;
            }, 0),
            fieldCount: allFields.length,
            availableFields: allFields.filter(function (field) {
                return field.status === 'available';
            }).length,
            maintenanceFields: allFields.filter(function (field) {
                return field.status === 'maintenance';
            }).length,
            customerCount: allCustomers.length,
            activeCustomers: allCustomers.filter(function (customer) {
                return customer.status === 'active';
            }).length,
            activeBookings: activeBookings.length,
            pendingBookings: allBookings.filter(function (booking) {
                return booking.status === 'pending';
            }).length,
            avgBookingValue: activeBookings.length
                ? activeBookings.reduce(function (sum, booking) {
                    return sum + booking.total;
                }, 0) / activeBookings.length
                : 0,
            bookedHours: activeBookings.reduce(function (sum, booking) {
                return sum + booking.durationHours;
            }, 0),
            todayBookings: activeBookings.filter(function (booking) {
                return booking.bookingDate === today;
            }).sort(compareUpcoming),
            recentBookings: allBookings.slice(0, 6),
            upcomingBookings: activeBookings.filter(function (booking) {
                return combineDateTime(booking.bookingDate, booking.startTime) >= now && booking.status !== 'completed';
            }).sort(compareUpcoming).slice(0, 6),
            topFields: clone(allFields).sort(function (a, b) {
                return b.bookingCount - a.bookingCount || b.revenue - a.revenue;
            }).slice(0, 5),
            topCustomers: clone(allCustomers).sort(function (a, b) {
                return b.totalSpent - a.totalSpent || b.bookingCount - a.bookingCount;
            }).slice(0, 5),
            typeStats: types.map(function (type) {
                const ownFields = allFields.filter(function (field) {
                    return field.type === type;
                });
                return {
                    label: type,
                    count: ownFields.length,
                    bookedHours: ownFields.reduce(function (sum, field) {
                        return sum + field.bookedHours;
                    }, 0),
                    revenue: ownFields.reduce(function (sum, field) {
                        return sum + field.revenue;
                    }, 0)
                };
            }),
            paymentStats: ['paid', 'deposit', 'unpaid', 'refunded'].map(function (key) {
                return {
                    key: key,
                    label: LABELS.payment[key],
                    count: allBookings.filter(function (booking) {
                        return booking.paymentStatus === key;
                    }).length
                };
            }),
            statusStats: ['pending', 'confirmed', 'completed', 'cancelled'].map(function (key) {
                return {
                    key: key,
                    label: LABELS.bookingStatus[key],
                    count: allBookings.filter(function (booking) {
                        return booking.status === key;
                    }).length
                };
            }),
            monthlyRevenue: Object.values(months).sort(function (a, b) {
                return a.month.localeCompare(b.month);
            }).slice(-6)
        };
    }

    window.Store = {
        LABELS: LABELS,
        init: init,
        login: login,
        resetAdminPassword: resetAdminPassword,
        logout: logout,
        requireAuth: requireAuth,
        redirectIfAuthenticated: redirectIfAuthenticated,
        currentAdmin: currentAdmin,
        fields: fields,
        customers: customers,
        bookings: bookings,
        saveField: saveField,
        saveCustomer: saveCustomer,
        savePublicBooking: savePublicBooking,
        saveBooking: saveBooking,
        removeField: removeField,
        removeCustomer: removeCustomer,
        removeBooking: removeBooking,
        analytics: analytics,
        money: money,
        hoursText: hoursText,
        dateText: dateText,
        esc: esc,
        combineDateTime: combineDateTime,
        durationHours: durationHours,
        bookingTotal: bookingTotal,
        exportData: function () {
            return {
                exportedAt: new Date().toISOString(),
                admin: currentAdmin(),
                fields: fields(),
                customers: customers(),
                bookings: bookings(),
                analytics: analytics()
            };
        }
    };
})();
