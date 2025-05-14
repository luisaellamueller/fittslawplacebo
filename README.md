# ai-hci-research

## Projektstruktur

```
AI-HCI-RESEARCH
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── fittsTaskController.js
│   │   ├── postQuestionnaireController.js
│   │   ├── preQuestionnaireController.js
│   │   └── probandsController.js
│   ├── models
│   │   ├── preQuestionnaireModel.js
│   │   └── probandModel.js
│   ├── node_modules
│   ├── routes
│   │   ├── fittsTask.js
│   │   ├── PostQuestionnaireResult.js
│   │   ├── PreQuestionnaireResult.js
│   │   ├── probands.js
│   │   ├── randomize.js
│   │   ├── storeroute.js
│   │   └── index.js
│   └── package-lock.json
```

## Randomization:

Es gibt 6 Möglichkeiten für die Reihenfolge:

| orderId | Reihenfolge |
|---------|-------------|
| 1 | ["Standard", "ML", "Physiologisch"] |
| 2 | ["Standard", "Physiologisch", "ML"] |
| 3 | ["ML", "Standard", "Physiologisch"] |
| 4 | ["ML", "Physiologisch", "Standard"] |
| 5 | ["Physiologisch", "Standard", "ML"] |
| 6 | ["Physiologisch", "ML", "Standard"] |

Jedesmal:
- pre questionnaire für entsprechendes experiment
- experiment 
- post questionnaire 

## Structure

Here's a detailed schema description for each of the four tables:

### 1. Table: fitts_experiment_results

This table stores the results of Fitts' Law experiment trials, capturing user interaction data and performance metrics.

| Field          | Type          | Null | Key  | Default | Extra           |
|----------------|---------------|------|------|---------|-----------------|
| id             | int           | NO   | PRI  | NULL    | auto_increment  |
| UserID         | int           | NO   |      | NULL    |                 |
| MausTyp        | varchar(255)  | NO   |      | NULL    |                 |
| TargetID       | int           | NO   |      | NULL    |                 |
| DifficultyIndex| float         | NO   |      | NULL    |                 |
| MT             | float         | NO   |      | NULL    |                 |
| ClickX         | float         | NO   |      | NULL    |                 |
| ClickY         | float         | NO   |      | NULL    |                 |
| TargetX        | float         | YES  |      | NULL    |                 |
| Width          | int           | NO   |      | NULL    |                 |
| Distance       | int           | NO   |      | NULL    |                 |
| Error          | int           | NO   |      | NULL    |                 |
| Level          | varchar(255)  | NO   |      | NULL    |                 |
| created_at     | timestamp     | YES  |      | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

### 2. Table: post_questionnaire_results

This table stores responses to a post-experiment questionnaire evaluating user experience with the input device.

| Field                | Type       | Null | Key | Default | Extra           |
|----------------------|------------|------|-----|---------|-----------------|
| id                   | int        | NO   | PRI | NULL    | auto_increment  |
| proband_id           | int        | NO   | MUL | NULL    |                 |
| maus_typ             | varchar(50)| NO   |     | NULL    |                 |
| frequent_use         | int        | NO   |     | NULL    |                 |
| complexity           | int        | NO   |     | NULL    |                 |
| easy_to_use          | int        | NO   |     | NULL    |                 |
| tech_support         | int        | NO   |     | NULL    |                 |
| functions_integrated | int        | NO   |     | NULL    |                 |
| everything_fits      | int        | NO   |     | NULL    |                 |
| quick_learning       | int        | NO   |     | NULL    |                 |
| intuitive            | int        | NO   |     | NULL    |                 |
| felt_secure          | int        | NO   |     | NULL    |                 |
| little_learning      | int        | NO   |     | NULL    |                 |
| created_at           | datetime   | NO   |     | NULL    |                 |

### 3. Table: pre_questionnaire_results

This table stores responses to a pre-experiment questionnaire about participant expectations and preferences.

| Field                | Type                           | Null | Key | Default            | Extra            |
|----------------------|--------------------------------|------|-----|--------------------|-----------------| 
| id                   | int                            | NO   | PRI | NULL               | auto_increment   |
| proband_id           | int                            | YES  | MUL | NULL               |                  |
| maus_typ             | enum('Standard','ML','Physiologisch') | NO |  | NULL               |                  |
| erwartete_performance| int                            | NO   |     | NULL               |                  |
| created_at           | timestamp                      | YES  |     | CURRENT_TIMESTAMP  | DEFAULT_GENERATED|

### 4. Table: probands

This table stores information about study participants (test subjects).

| Field                 | Type                          | Null | Key | Default           | Extra             |
|-----------------------|-------------------------------|------|-----|-------------------|-------------------|
| id                    | int                           | NO   | PRI | NULL              | auto_increment    |
| vorname               | varchar(255)                  | NO   |     | NULL              |                   |
| nachname              | varchar(255)                  | NO   |     | NULL              |                   |
| geburtsdatum          | date                          | NO   |     | NULL              |                   |
| technischer_studiengang| tinyint(1)                   | NO   |     | NULL              |                   |
| stufe                 | enum('Bachelor','Master','PhD')| YES |     | NULL              |                   |
| created_at            | timestamp                     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| gender                | varchar(50)                   | YES  |     | NULL              |                   |
| self_described_gender | varchar(255)                  | YES  |     | NULL              |                   |
| use_data              | tinyint(1)                    | YES  |     | NULL              |                   |
| data_quality_reason   | text                          | YES  |     | NULL              |                   |

### Database Relationships

Based on the schema:

1. The `probands` table serves as the main participant table
2. `proband_id` in `pre_questionnaire_results` and `post_questionnaire_results` references `id` in `probands`
3. `UserID` in `fitts_experiment_results` likely references `id` in `probands`

## Getting started

Set up the SQL DB according to the above schema. 

In the backend folder:

Run:

```
npm install express
npm install file-saver
```
In the frontend/proband frontend dir, run:

```
npm install vite --save-dev
```


Start the backend server.
In the /backend directory run:

```
node index.js
```

Start the frontend:
Start the mysql server:

```
sudo /usr/local/mysql/support-files/mysql.server start
```


Login to it:

```
mysql -u root -p
```

Enter a password. 

## Authors and acknowledgment
Luisa Müller, developer

## License
This belongs to a bachelor thesis submitted in May 2025. 
