module.exports = (db) => {
    const random_country = require('random-country-name');

    const genders = [
        'boy',
        'girl',
        'nonbinary'
    ];
    const gender = randomItem(genders);

    let country = random_country.random();
    if (country === 'Congo') country = random_country.random();

    let ue = [];
    let brics = [];
    if (process.argv.includes('--with-orgs')) {
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

    if (gender === 'boy') {
        const n = ue.includes(country) || brics.includes(country) ? randomNumber(0, 15) : randomNumber(0, 10);
        
        db.add('boys', n);
        db.add(`population_${country.replace(/ /g, '')}`, n);
        db.add('humans_count', n);
    }
    else if (gender === 'girl') {
        const n = ue.includes(country) || brics.includes(country) ? randomNumber(0, 15) : randomNumber(0, 10);

        db.add('girls', n);
        db.add(`population_${country.replace(/ /g, '')}`, n);
        db.add('humans_count', n);
    }
    else if (gender === 'nonbinary') {
        const n = ue.includes(country) || brics.includes(country) ? randomNumber(0, 15) : randomNumber(0, 10);

        db.add('nonbinary', n);
        db.add(`population_${country.replace(/ /g, '')}`, n);
        db.add('humans_count', n);
    }

    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + min));
    }
}