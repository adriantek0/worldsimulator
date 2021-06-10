const db = require('quick.db');
const chalk = require('chalk');
const random_country = require('random-country-name');
const moment = require('moment');
require('moment-duration-format');

setInterval(async () => {
    require('./methods/createLife')(db);
}, 1000);

setInterval(() => {
    db.add('day', 1);
}, 5000);

setInterval(async () => {
    await require('./modules/checks')(db);
    const news = db.fetch('news');
    const boys = db.fetch('boys');
    const girls = db.fetch('girls');
    const nonbs = db.fetch('nonbinary');
    const total = db.fetch('humans_count');
    const day = db.fetch('day');
    const month = db.fetch('month');
    const year = db.fetch('year');
    let registered = db.fetch('registered');
    const government = db.fetch('government');
    const system = db.fetch('system');
    const km2 = db.fetch('km2') || 10000;
    const a_countries = [];

    if (year === null) db.set('year', 2010);
    if (day === null) db.set('day', 1);
    if (month === null) db.set('month', 1);

    if (!db.has('registered')) {
        db.set('registered', new Date());
        registered = db.fetch('registered');
    }
    registered = new Date(registered);

    if (day === 30) {
        db.set('day', 1);
        db.add('month', 1);
    }

    if (month === 12) {
        db.set('day', 1);
        db.set('month', 1);
        db.add('year', 1);
    }

    await random_country.all.forEach(async (country) => {
        const pop = db.fetch(`population_${country.replace(/ /g, '')}`)
        if (pop === null) return;
        if(a_countries.filter(a => a.name === country).length === 1) return;
        a_countries.push({ name: country, pop: pop })
    })

    const sort = a_countries.sort(function(a, b) {
        if (a.pop > b.pop) {
            return -1;
        }
        if (a.pop < b.pop) {
            return 1;
        }
        return 0;
    });

    const args = process.argv;

    console.clear();
    console.log(chalk.green('Día: ' + day + '/' + month + '/' + year))
    console.log(chalk.green('Humanos en La Tierra: ') + chalk.red(total.toLocaleString()))
    console.log('├── Hombres: ' + chalk.yellow(boys) + ' (' + getPerc(boys, total) + '%)')
    console.log('├── Mujeres: ' + chalk.yellow(girls) + ' (' + getPerc(girls, total) + '%)')
    console.log('├── No binarios: ' + chalk.yellow(nonbs) + ' (' + getPerc(nonbs, total) + '%)')
    console.log('└── Densidad: ' + chalk.yellow((total / km2).toFixed(2)) + 'h/k2')

    console.log(' ');
    console.log(chalk.green('Información:'))
    console.log('├── Forma de gobierno: ' + chalk.yellow(government))
    console.log('├── Gobernador: ' + chalk.yellow(args.includes('--governor') ? args[(args.indexOf('--governor') + 1)] : 'Adrián II de España'));
    console.log('├── Sistema: ' + chalk.yellow(system));
    console.log('└── Tiempo activo: ' + chalk.yellow(moment.duration(new Date().getTime() - registered.getTime()).format('d[d], h[h], m[m], s[s]')));

    if (total > 2000) {
        require('./methods/createPhenomena')(db);
    }
    if (news !== null && news.length === 1) {
        console.log(' ');
        console.log(chalk.red('NEWS: ' + news[0]));
    }
    console.log(' ');
    if (!args.includes('--with-pibs')) {
        console.log(chalk.green('TOP 20 países más poblados'))
    }
    else {
        console.log(chalk.green('TOP 15 países más poblados / TOP 10 economías:'))
    }

    let count = 1;
    sort.forEach((info) => {
        let num = 9;
        if (args.includes('--with-pibs')) {
            if (count === 10) return;
        }
        else {
            if (count === 16) return;
            num = 15;
        }

        const ue1 = chalk.yellow('├── ' + count + '. ') + info.name + chalk.blue.bold(' (UE)') + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';
        const ue2 = chalk.yellow('└── ' + count + '. ') + info.name + chalk.blue.bold(' (UE)') + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';
        const brics1 = chalk.yellow('├── ' + count + '. ') + info.name + chalk.green.bold(' (BRICS)') + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';
        const brics2 = chalk.yellow('└── ' + count + '. ') + info.name + chalk.green.bold(' (BRICS)') + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';
        const pib1 = chalk.yellow('│   └── PIB: ' + (info.pop * 33000).toLocaleString() + '€')
        const pib2 = chalk.yellow('    └── PIB: ' + (info.pop * 33000).toLocaleString() + '€')
        const info1 = chalk.yellow('├── ' + count + '. ') + info.name + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';
        const info2 = chalk.yellow('└── ' + count + '. ') + info.name + ': ' + info.pop + ' people (' + getPerc(info.pop, total) + '% mundial)';

        let ue = [];
        let brics = [];
        if (args.includes('--with-orgs')) {
            ue = [
                "Austria", "Belgium", "Bulgaria", "Cyprus",
                "Czech Republic", "Denmark", "Estonia", "Finland", "France",
                "Germany", "Greece", "Hungary", "Ireland", "Italy",
                "Latvia", "Lithuania", "Luxembourg", "Netherlands", "Poland", "Portugal",
                "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
            ];
    
            brics = [
                "Brazil", "Russia", "India", "China", "South Africa"
            ];
        }

        if (count === num) {
            if (ue.includes(info.name)) {
                console.log(ue2);
            }
            else if (brics.includes(info.name)) {
                console.log(brics2);
            }
            else {
                console.log(info2);
            }

            if (args.includes('--with-pibs')) {
                console.log(pib2);
            }
            count++;
            return;
        }
        if (ue.includes(info.name)) {
            console.log(ue1);
        }
        else if (brics.includes(info.name)) {
            console.log(brics1);
        }
        else {
            console.log(info1);
        }
        if (args.includes('--with-pibs')) {
            console.log(pib1);
        }
        count++;
    })
}, 2000);

function getPerc(num, tot) {
    if (!num || !tot || isNaN(tot) || isNaN(num)) return;
	return ((parseInt(num) * 100) / tot).toFixed(2);
}