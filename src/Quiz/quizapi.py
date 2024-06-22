#!/usr/bin/env python3

import openai
import random
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector


openai.api_key = 'sk-proj-9Vsy8Swe2MjVsfx3xQSZT3BlbkFJ7HUSgD6bJVu2ZCJf3VTg'

def generer_questions_qcm(texte, nbqst=5):
    prompt = f"Génère {nbqst} questions à choix multiples basées sur le texte suivant:\n\n{texte}\n\n"
    prompt += "Pour chaque question, donnez 4 options de réponse, avec la bonne réponse indiquée.\n"

    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",  
        prompt=prompt,
        max_tokens=500, 
        n=1, 
        stop=None,
        temperature=0.7
    )

    questions = response.choices[0].text.strip()
    return questions





def formater_questions(questions_texte):
    questions_liste = []
    questions_split = questions_texte.strip().split('\n\n')

    for q in questions_split:
        lines = q.strip().split('\n')

        if len(lines) < 6:
            continue

        question_text = lines[0]
        if question_text[0].isdigit() and question_text[1:3] in [") ", ". "]:
            question_text = question_text.split(' ', 1)[1]

        distractors = []  
        answer_line = lines[5].split(': ')[1].strip() 


        if answer_line.startswith(('a. ', 'b. ', 'c. ', 'd. ')):
            correct_index = ord(answer_line[0]) - ord('a')
            if ') ' in answer_line:
                answer = answer_line.split(') ', 1)[1]
            else:
                answer = answer_line.split(' ', 1)[1]
        else:
            if ') ' in answer_line:
                answer = answer_line.split(') ', 1)[1]
            else:
                answer = answer_line

        options = lines[1:5]
        random.shuffle(options)

        for option in options:
            distractors.append(option.split(') ', 1)[1] if ') ' in option else option.split(' ', 1)[1])

        question_dict = {
            'question': question_text,
            'distractors': distractors,
            'answer': answer
        }
        questions_liste.append(question_dict)

    return questions_liste


app = Flask(__name__)
CORS(app)

#cnx
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="mqstvalidate"
)

mycursor = mydb.cursor()



@app.route("/", methods=["POST"])
def index():
    data = request.json
    results = []
    if not data or not isinstance(data, list):
        return jsonify({"error": "Invalid input"}), 400

    combined_text = ""  
    for item in data:
        texte = item.get('text')
        if not texte:
            return jsonify({"error": "No text provided in one of the items"}), 400 
        combined_text += texte + " "  
        
    print(combined_text)
    questions_texte = generer_questions_qcm(combined_text)
    formatted_questions = formater_questions(questions_texte)
    print(f"questions: {formatted_questions}")
    
    return jsonify(formatted_questions)




@app.route('/validate', methods=['POST', 'GET'])
def validate():
    if request.method == 'POST':
        try:
            modified_questions = request.json
            if not isinstance(modified_questions, list):
                return jsonify({"error": "Invalid input format, expecting a list of questions"}), 400
            
            print("Structure de modified_questions:")
            for question in modified_questions:
                print(question)
            
            for question in modified_questions:
                mycursor.execute("SELECT id FROM questions WHERE question = %s", (question['question'],))
                existing_question = mycursor.fetchone()
                
                if existing_question:
                    mycursor.execute("UPDATE questions SET distractors = %s, answer = %s WHERE id = %s",
                                     (json.dumps(question['distractors']), question['answer'], existing_question['id']))
                else:
                    mycursor.execute("INSERT INTO questions (question, distractors, answer) VALUES (%s, %s, %s)", 
                                     (question['question'], json.dumps(question['distractors']), question['answer']))
                
                mydb.commit()  
        
            return jsonify({"message": "Data inserted/updated successfully"}), 200
        
        except Exception as e:
            print(f"Error processing POST request: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == "GET":
        mycursor.execute("SELECT id, question, distractors, answer FROM questions")
        modified_questions = [{'id': row[0], 'question': row[1], 'distractors': json.loads(row[2]), 'answer': row[3]} for row in mycursor.fetchall()]
        
        return jsonify(modified_questions)




@app.route("/correct", methods=["POST"])
def correction():
    if request.method == "POST":
        responses = request.json
        mycursor.execute("SELECT id, answer FROM questions")
        questions_with_answers = {str(row[0]): row[1] for row in mycursor.fetchall()} 
        

        correct_count = 0
        for question_id, user_responses in responses.items():
            if question_id in questions_with_answers:

                all_correct = True
                for user_response in user_responses:
                    if user_response.strip() == "":
                        continue
                    if user_response not in questions_with_answers[question_id]:
                        all_correct = False
                        break
                if all_correct:
                    correct_count += 1
        
        return jsonify({"correct_answers": correct_count})



@app.route("/add_question", methods=["POST"])
def add_question():
    new_question = request.json
    
    if not new_question:
        return jsonify({"error": "No data provided"}), 400

    question = new_question['question']
    answer = new_question['answer']
    distractors = new_question['distractors']

    try:
        mycursor.execute("SELECT id FROM questions WHERE question = %s", (question,))
        existing_question = mycursor.fetchone()
        if existing_question:
            return jsonify({"error": "Question already exists"}), 400
        else:
            mycursor.execute("INSERT INTO questions (question, distractors, answer) VALUES (%s, %s, %s)", 
                             (question, json.dumps(distractors), answer))
            mydb.commit()
        return jsonify({"message": "Question added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/questions/<int:question_id>", methods=["DELETE"])
def delete_question(question_id): 
    try:

        mycursor.execute("DELETE FROM questions WHERE id = %s", (question_id,))
        mydb.commit()
        return jsonify({"message": "Question deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()

