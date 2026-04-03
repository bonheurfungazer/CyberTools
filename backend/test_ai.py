import numpy as np
from app.core.ai_utils import ai_engine

def test_ai_engine():
    print("Testing AI Anomaly Detector...")

    # Force train
    ai_engine.train_on_mock()
    print("Model trained.")

    # Test Normal Log (Small request, 200 OK, fast)
    normal_features = [120, 200, 50, 0]
    res_normal = ai_engine.predict(normal_features)
    print(f"Normal Prediction: {res_normal}")
    assert res_normal["is_anomaly"] == False, "Should be normal"

    # Test Anomaly Log (Huge request, 500 Error, slow, admin)
    anomaly_features = [8000, 500, 3000, 1]
    res_anomaly = ai_engine.predict(anomaly_features)
    print(f"Anomaly Prediction: {res_anomaly}")
    assert res_anomaly["is_anomaly"] == True, "Should be anomaly"

    print("AI Test Passed")

if __name__ == "__main__":
    test_ai_engine()
