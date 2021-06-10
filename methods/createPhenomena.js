module.exports = async (db) => {
    const number = randomNumber(1, 120);
    if (number === 119) {
        const random_city = require('random-city-from-list');
        let city = random_city.random();

        const phenomenaInfo = require('../data/phenomena.json');
        const phenomenas = Object.keys(phenomenaInfo);
        
        const phenomena = randomItem(phenomenas);
        const { message, maxKills, minKills } = phenomenaInfo[phenomena];

        const kills = randomNumber(minKills, maxKills);

        const random_country = require('random-country-name');
        city = city.city + ' (' + city.state + ')';
        db.set('news', []);
        const message1 = message
                        .replace(/{ciudad}/g, city)
                        .replace(/{personas}/g, kills)
                        .replace(/{countryattack}/g, random_country.random())

        db.push('news', message1);

        const total = await db.fetch('humans_count');

        if (total <= kills) {
            db.set('humans_count', 0);
            db.set('boys', 0);
            db.set('girls', 0);
            db.set('nonbinary', 0);
            return;
        }
        db.subtract('humans_count', kills);
        db.subtract('boys', Math.floor(kills / 3));
        db.subtract('girls', Math.floor(kills / 3));
        db.subtract('nonbinary', Math.floor(kills / 3));

        setTimeout(() => {
            db.set('news', []);
        }, 300000);
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + min));
    }

    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}