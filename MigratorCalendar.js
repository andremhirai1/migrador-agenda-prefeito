import fetch from 'node-fetch';
import data from './data/data.json' assert { type: 'json' };;

const PORTAL_USER = 'test@liferay.com';
const PORTAL_PASSWORD = 'test';
const PORTAL_URL = 'https://webserver-lctcustomersummit-prd.lfr.cloud:443';
const OBJECTS_URI = '/o/c/agendas/batch';
const SITE_ID = 20119;
const HAS_PUBLISH_DATE_ATTRIBUTE = true;

class MigratorCalendar {
    constructor(array) {
        this.array = this.formatDate(array);
    }

    formatDate(array) {
        let formattedArray = array.map(item => {
            if (item.startDate !== '') {
                if (HAS_PUBLISH_DATE_ATTRIBUTE) delete item.publishDate;

                return {
                    ...item,
                    startDate: this.formatHours(item.startDate),
                    endDate: this.formatHours(item.endDate),
                    siteID: SITE_ID
                }
            }
        });

        return formattedArray.filter(item => item !== undefined)
    }

    formatHours(stringDate) {
        let newDate = new Date(stringDate);
        newDate.setHours(newDate.getHours() - 3);
        return newDate.toISOString();
    }

    async postBatchCalendarItems() {
        try {
            const response = await fetch(PORTAL_URL + OBJECTS_URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(PORTAL_USER + ':' + PORTAL_PASSWORD)
                },
                body: JSON.stringify(this.array)
            })

            if (!response.ok) {
                throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            console.log('\x1b[32m Processo de migração finalizado com sucesso!')
            console.log('\x1b[32m Foram migrados ' + data.totalItemsCount + '/' + this.array.length);

        } catch (error) {
            console.error('\x1b[31m Erro durante a migração:' + error.message);
        }
    }

    start() {
        console.log("\x1b[34m Iniciando migração");
        this.postBatchCalendarItems();
    }
}

let migrator = new MigratorCalendar(data)

migrator.start();
