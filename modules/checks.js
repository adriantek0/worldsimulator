module.exports = async (db) => {
    const news = await db.fetch('news');
    const boys = await db.fetch('boys');
    const girls = await db.fetch('girls');
    const nonbs = await db.fetch('nonbinary');
    const total = await db.fetch('humans_count');
    const day = await db.fetch('day');
    const month = await db.fetch('month');
    const year = await db.fetch('year');

    if (!news || news === null) {
        db.set('news', []);
    }

    if (!boys || boys === null || boys < 1) {
        db.set('boys', 0);
    }

    if (!girls || girls === null || girls < 1) {
        db.set('girls', 0);
    }

    if (!nonbs || nonbs === null || nonbs < 1) {
        db.set('nonbs', 0);
    }

    if (!total || total === null || total < 1) {
        db.set('total', 0);
    }

    if (!day || day === null || day < 1 || day > 30) {
        db.set('day', 1);
    }

    if (!month || month === null || month < 1 || month > 30) {
        db.set('month', 1);
    }

    if (!year || year === null || year < 2010) {
        db.set('year', 2010);
    }

    const args = process.argv;
    if (args.includes('--km2')) {
        if (isNaN(args[args.indexOf('--km2') + 1])) {
            throw new Error('Los kilómetros cuadrados deben ser un número.');
        }
        db.set('km2', args[args.indexOf('--km2') + 1]);
    }

    if (args.includes('--government')) {
        const governments = {
            'R': 'República',
            'M': 'Monarquía',
            'MA': 'Monarquía absoluta',
            'I': 'Imperio',
            'A': 'Anarquía'
        };
        if (!governments[args[args.indexOf('--government') + 1]]) {
            throw new Error('La forma de gobierno es inválida.');
        }
        db.set('government', governments[args[args.indexOf('--government') + 1]]);
    }

    if (args.includes('--system')) {
        const systems = {
            'CO': 'Comunismo',
            'CA': 'Capitalismo',
        };
        if (!systems[args[args.indexOf('--system') + 1]]) {
            throw new Error('El sistema es inválido.');
        }
        db.set('system', systems[args[args.indexOf('--system') + 1]]);
    }
}