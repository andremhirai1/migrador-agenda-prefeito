**

## Passos para executar a migração da agenda


1) Renomear os campos do arquivo csv para:

- Data de inicio -> startDate

- Data de fim -> endDate

- Data publicacao -> publishDate

- Local -> location

- Título -> title

  
2) Transformar o csv em json neste link: [https://kinoar.github.io/xlsx-to-json/](https://kinoar.github.io/xlsx-to-json/)

3) Colocar o arquivo json gerado na pasta `data` com o nome de **data.json** (caso exista um arquivo data.json, sobreescrever o arquivo)

  

4) Entrar no arquivo `MigratorCalendar.js` e trocar as variáveis abaixo para as correspondentes:
  

> **PORTAL_USER** = usuário que acessa o portal (Ex: test@liferay.com);
> 
> **PORTAL_PASSWORD** = senha do usuário que acessa o portal (Ex: test);
> 
> **PORTAL_URL** = URL do portal (Ex: https://webserver-prefeiturasp-dev.lfr.cloud/);
> 
> **OBJECTS_URI** = URI da api do portal que utiliza o batch (Ex: /o/agendas/batch)
> 
> **SITE_ID** = ID do site que será migrado os itens da agenda; (Ex: 20119)
> 
> **HAS_PUBLISH_DATE_ATTRIBUTE** = se o objeto possuir o campo publishDate, colocar campo como true;

  

5) Executar na raiz do projeto os seguintes comandos:

`npm install`

`node MigratorCalendar.js`
