import fetch from 'node-fetch';
import data from './data/data.json' assert { type: 'json' };;

const PORTAL_USER = 'test@prefeitura.sp.gov.br';
const PORTAL_PASSWORD = 'liferay@prefeituraadmin';
const PORTAL_URL = 'https://webserver-prefeiturasp-dev.lfr.cloud';
const OBJECTS_URI = '/o/c/calendars/scopes/';
const SITE_ID = 34276;
const HAS_PUBLISH_DATE_ATTRIBUTE = true;

class MigratorCalendar {
    constructor(array) {
        this.array = this.formatObject(array);
        this.batches = [];
    }

    formatObject(array) {
        let formattedArray = array.map(item => {
            if (item.startDate !== '') {
                if (HAS_PUBLISH_DATE_ATTRIBUTE) delete item.publishDate;

                return {
                    title: item.title,
                    startDate: this.formatHours(item.start),
                    //endDate: this.formatHours(item.endDate),
                    description: '',
                    location: item.descricao
                    //siteID: SITE_ID
                }
            }
        });

        return formattedArray.filter(item => item !== undefined)
    }

    formatHours(stringDate) {
        const index = stringDate.indexOf(":");
        const dateFormatted = stringDate.substring(0, index) + "" + stringDate.substring(index + ":".length);
        let newDate = new Date(dateFormatted);
        newDate.setHours(newDate.getHours() - 3);
        return newDate.toISOString();
    }

    async postBatchCalendarItem(item) {
        try {
            console.log(item)
            const response = await fetch(PORTAL_URL + OBJECTS_URI + SITE_ID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(PORTAL_USER + ':' + PORTAL_PASSWORD)
                },
                body: JSON.stringify(item)
            })

            if (!response.ok) {
                throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            console.log('\x1b[32m Processo de migração finalizado com sucesso!')
            //console.log('\x1b[32m Foram migrados ' + this.array.length);

        } catch (error) {
            console.error('\x1b[31m Erro durante a migração:' + error.message);
        }
    }

    async processPosts(array) {
        const batchSize = 100; // Número máximo de requisições simultâneas
        
        for (let i = 0; i < array.length; i += batchSize) {
            this.batches.push(array.slice(i, i + batchSize));
        }
    
        // Processa cada lote sequencialmente
        for (const batch of this.batches) {
            await Promise.all(batch.map(item => this.postBatchCalendarItem(item)));
        }
    }

    start() {
        console.log("\x1b[34m Iniciando migração");
        this.processPosts(this.array);
        
    }
}

let migrator = new MigratorCalendar(data)

migrator.start();
