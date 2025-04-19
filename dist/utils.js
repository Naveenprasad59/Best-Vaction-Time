import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });
const questions = [
    'Enter the year to check: ',
    'Enter the quarter to check: ',
    'Enter the number of days to check: '
];
export const askQuestions = async () => {
    const answers = [];
    for (const question of questions) {
        const answer = await rl.question(question);
        answers.push(Number(answer));
    }
    console.log("\nYour Answers:");
    rl.close();
    return answers;
};
