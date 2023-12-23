import fetch from 'node-fetch';
import data from './data/data.json' assert { type: 'json' };;

const PORTAL_USER = 'test@liferay.com';
const PORTAL_PASSWORD = 'test';
const PORTAL_URL = 'https://webserver-lctcustomersummit-prd.lfr.cloud:443';
const OBJECTS_URI = '/o/c/agendas/batch';
const SITE_ID = 0;
const HAS_PUBLISH_DATE_ATTRIBUTE = true;

class MigratorCalendar {
    constructor(array) {
        this.array = this.formatDate(array);
    }

    formatDate(array) {
        let formattedArray = array.map(item => {
            if (item.startDate !== '') {
                if(HAS_PUBLISH_DATE_ATTRIBUTE) delete item.publishDate;

                return {
                    ...item,
                    startDate: new Date(item.startDate).toISOString(),
                    endDate: new Date(item.endDate).toISOString(),
                    siteID: SITE_ID
                }
            }
        });

        return formattedArray.filter(item => item !== undefined)
    }

    async batchCalendar() {
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

            console.log('%cProcesso de migração finalizado com sucesso!', 'color:green')
            console.log('Foram migrados ' + data.totalItemsCount + '/' + this.array.length);

        } catch (error) {
            console.error('%cErro durante a migração:' + error.message, 'color:red');
        }
    }

    start() {
        console.log('%cIniciando migração', 'color:yellow');
        this.batchCalendar();
    }
}

let migrator = new MigratorCalendar(data)

migrator.start();
