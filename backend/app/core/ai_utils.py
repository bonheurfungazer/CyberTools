import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os
import random

MODEL_PATH = "log_anomaly_model.pkl"

class LogAnomalyDetector:
    def __init__(self):
        self.model = None
        self.is_trained = False
        # Load model if exists, otherwise train on mock data
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.is_trained = True
            except:
                self.train_on_mock()
        else:
            self.train_on_mock()

    def generate_mock_data(self, n_samples=1000):
        """
        Generates mock log feature data.
        Features: [request_length, response_code, duration_ms, is_admin_page]
        """
        data = []
        # Normal traffic (95%)
        for _ in range(int(n_samples * 0.95)):
            req_len = random.randint(50, 500)
            res_code = random.choice([200, 200, 200, 301, 404])
            duration = random.randint(10, 100)
            is_admin = 0
            data.append([req_len, res_code, duration, is_admin])

        # Anomalies / Attacks (5%)
        for _ in range(int(n_samples * 0.05)):
            req_len = random.randint(1000, 10000) # Huge payload (SQLi/XSS)
            res_code = random.choice([403, 500, 401]) # Errors
            duration = random.randint(500, 5000) # Slowloris / heavy processing
            is_admin = random.choice([0, 1]) # Targeting admin
            data.append([req_len, res_code, duration, is_admin])

        return np.array(data)

    def train_on_mock(self):
        """
        Trains the Isolation Forest model on mock data.
        """
        X = self.generate_mock_data()
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self.model.fit(X)
        self.is_trained = True
        try:
            joblib.dump(self.model, MODEL_PATH)
        except Exception as e:
            print(f"Failed to save model: {e}")
        return {"status": "Trained", "n_samples": len(X)}

    def predict(self, features):
        """
        Predicts if a log entry is anomalous.
        features: list or numpy array [request_length, response_code, duration_ms, is_admin_page]
        Returns: -1 (Anomaly) or 1 (Normal)
        """
        if not self.is_trained:
            self.train_on_mock()

        # Reshape for single sample
        X = np.array(features).reshape(1, -1)
        prediction = self.model.predict(X)[0]
        score = self.model.decision_function(X)[0]

        return {
            "prediction": "Anomaly" if prediction == -1 else "Normal",
            "anomaly_score": float(score), # Lower score = more anomalous
            "is_anomaly": bool(prediction == -1)
        }

# Singleton instance
ai_engine = LogAnomalyDetector()
