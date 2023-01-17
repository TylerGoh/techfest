from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import json
from numpy import nan
import numpy as np
import datetime
import numpy as np
import pandas as pd
from csv import writer

offers = pd.read_csv('Offers.csv')
data = pd.read_csv('Forecast.csv')
holidays = pd.read_csv('Holidays.csv')
dates = pd.read_csv('Dates.csv')

storage = {
    "iPhone 14":{
        "threshold": 10000,
        "sales":100000,
    },
    "iPhone 13":{
        "threshold": 10000,
        "sales":100000
    },
    "Galaxy S21":{
        "threshold":10000,
        "sales":100000,
    },
    "Galaxy S22":{
        "threshold":10000,
        "sales":100000
    },
    "Galaxy S23":{
        "threshold":10000,
        "sales":100000,
    }
}

app = Flask(__name__)
CORS(app)















df = pd.read_csv('Forecast.csv')
models = df['Model'].unique().tolist()

































def getBrand(model):
    if model == "iPhone 14" or model == "iPhone 13":
        return "Apple"
    else:
        return "Samsung"

def loadData():
    ## for statistical tests
    import scipy
    ## for machine learning
    from sklearn import model_selection, preprocessing, feature_selection, ensemble, linear_model, metrics, decomposition

    offers = pd.read_csv('Offers.csv')
    data = pd.read_csv('Forecast.csv')
    holidays = pd.read_csv('Holidays.csv')
    dates = pd.read_csv('Dates.csv')

    model = pd.get_dummies(data.Model, prefix='Model')
    clean_data = data[data["# Actuals"].notna()].copy()
    clean_data = clean_data.join(model).copy()

    # Setting the training set
    X_names = ['Model_iPhone 14', 'Week ID', 'Year', "Model_Galaxy S21", "Model_Galaxy S22"]
    
    X = clean_data[X_names].values
    y = clean_data['# Actuals'].values

    # Call model
    model = ensemble.GradientBoostingRegressor()

    # Model training
    model.fit(X, y)

    # Predicting entire database

    phone_model = pd.get_dummies(data.Model, prefix='Model')
    data = data.join(phone_model)
    X_test = data[X_names].values

    prediction = model.predict(X_test)
    
    df_pred = pd.DataFrame(prediction, columns = ['# Predicted'])
    df_pred = df_pred.reset_index(drop=True)
    df_pred = df_pred.astype({'# Predicted':'int'})

    df_results = data
    df_results = df_results.reset_index(drop=True)
    df_results = df_results.join(df_pred)
    return df_results

df = loadData()



@app.route("/getModels",methods = ['GET'])
def modelsAPI():
    if request.method == 'GET':
        return json.dumps(models)

import time

@app.route("/getGraphs",methods = ['POST'])
def graphsAPI():
    if request.method == 'POST':
        data = request.get_json()
        model = data['model']
        year = data['year']
        df = loadData()
        df2 = df[(df['Model'] == model) & (df['Year']==year)].fillna(0)
        df2 = df2[['# Actuals','Week ID', '# Predicted']].reset_index(drop = True)
        df2 = df2.sort_values(by=['Week ID'])
        df2 = df2.reset_index()
        df2 = df2.to_json()
        return json.dumps(df2)
@app.route("/addSale",methods = ['POST'])
def addSale():
    if request.method == 'POST':
        data = request.get_json()
        model = data['model']
        year = data['year']
        week = data['week']
        sales = data['sales']
        storage[model]['sales'] = int(storage[model]['sales']) - int(sales)
        brand = getBrand(model)
        with open('Forecast.csv', 'a') as f_object:
            writer_object = writer(f_object)
            writer_object.writerow([year,week,brand,model,sales])
            f_object.close()
        sample = df[(df['Week ID']>week) & (df['Week ID']<week+4) & (df['Model'] == model)]
        if(storage[model]['sales']-sample["# Predicted"].sum()<storage[model]['threshold']):
            return "danger"
        else:
            return "safe"

@app.route("/storage", methods = ['POST','GET'])
def storageAPI():
    if request.method == 'GET':
        return json.dumps(storage)
    if request.method == 'POST':
        data = request.get_json()
        storage[data['model']]['sales'] = data['amount']
        storage[data['model']]['threshold'] = data['threshold']
        return "none"

if __name__ == "__main__":
  app.run()