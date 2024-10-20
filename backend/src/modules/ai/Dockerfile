# ai/Dockerfile

FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001  # Corrected to match the docker-compose port

CMD ["python", "recommendation_service.py"]
