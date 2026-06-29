FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install -r server/requirements.txt

RUN apt-get update && apt-get install -y nodejs npm

RUN cd client && npm install && npm run build

EXPOSE 7860

CMD ["python", "-m", "uvicorn", "server.app.main:app", "--host", "0.0.0.0", "--port", "7860"]