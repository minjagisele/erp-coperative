from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cooperative.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

# Models
class Member(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relations
    products = db.relationship('Product', backref='member', lazy=True)
    payments = db.relationship('Payment', backref='member', lazy=True)

class Product(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)  # kg, litres, pieces, etc.
    collection_date = db.Column(db.DateTime, default=datetime.utcnow)
    quality_grade = db.Column(db.String(10))  # A, B, C
    status = db.Column(db.String(20), default='collected')  # collected, sold, processed
    traceability_code = db.Column(db.String(50), unique=True, nullable=False)
    
    # Foreign keys
    member_id = db.Column(db.String(36), db.ForeignKey('member.id'), nullable=False)
    
    # Relations
    transactions = db.relationship('Transaction', backref='product', lazy=True)

class Buyer(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    
    # Relations
    transactions = db.relationship('Transaction', backref='buyer', lazy=True)

class Transaction(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quantity = db.Column(db.Float, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    
    # Foreign keys
    product_id = db.Column(db.String(36), db.ForeignKey('product.id'), nullable=False)
    buyer_id = db.Column(db.String(36), db.ForeignKey('buyer.id'), nullable=False)

class Payment(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method = db.Column(db.String(20), nullable=False)  # cash, bank_transfer, mobile_money
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    due_date = db.Column(db.DateTime)
    
    # Foreign keys
    member_id = db.Column(db.String(36), db.ForeignKey('member.id'), nullable=False)
    transaction_id = db.Column(db.String(36), db.ForeignKey('transaction.id'))

# API Routes
@app.route('/api/members', methods=['GET', 'POST'])
def members():
    if request.method == 'GET':
        members = Member.query.filter_by(is_active=True).all()
        return jsonify([{
            'id': member.id,
            'name': member.name,
            'email': member.email,
            'phone': member.phone,
            'address': member.address,
            'join_date': member.join_date.isoformat()
        } for member in members])
    
    elif request.method == 'POST':
        data = request.get_json()
        member = Member(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address')
        )
        db.session.add(member)
        db.session.commit()
        return jsonify({'id': member.id, 'message': 'Member created successfully'}), 201

@app.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify([{
            'id': product.id,
            'name': product.name,
            'quantity': product.quantity,
            'unit': product.unit,
            'collection_date': product.collection_date.isoformat(),
            'quality_grade': product.quality_grade,
            'status': product.status,
            'traceability_code': product.traceability_code,
            'member_name': product.member.name
        } for product in products])
    
    elif request.method == 'POST':
        data = request.get_json()
        import random
        import string
        
        traceability_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        product = Product(
            name=data['name'],
            quantity=data['quantity'],
            unit=data['unit'],
            quality_grade=data.get('quality_grade'),
            member_id=data['member_id'],
            traceability_code=traceability_code
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'id': product.id, 'traceability_code': traceability_code}), 201

@app.route('/api/buyers', methods=['GET', 'POST'])
def buyers():
    if request.method == 'GET':
        buyers = Buyer.query.filter_by(is_active=True).all()
        return jsonify([{
            'id': buyer.id,
            'name': buyer.name,
            'email': buyer.email,
            'phone': buyer.phone,
            'company': buyer.company
        } for buyer in buyers])
    
    elif request.method == 'POST':
        data = request.get_json()
        buyer = Buyer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            company=data.get('company')
        )
        db.session.add(buyer)
        db.session.commit()
        return jsonify({'id': buyer.id, 'message': 'Buyer created successfully'}), 201

@app.route('/api/transactions', methods=['GET', 'POST'])
def transactions():
    if request.method == 'GET':
        transactions = Transaction.query.all()
        return jsonify([{
            'id': transaction.id,
            'quantity': transaction.quantity,
            'unit_price': transaction.unit_price,
            'total_amount': transaction.total_amount,
            'transaction_date': transaction.transaction_date.isoformat(),
            'status': transaction.status,
            'product_name': transaction.product.name,
            'buyer_name': transaction.buyer.name,
            'member_name': transaction.product.member.name
        } for transaction in transactions])
    
    elif request.method == 'POST':
        data = request.get_json()
        transaction = Transaction(
            quantity=data['quantity'],
            unit_price=data['unit_price'],
            total_amount=data['quantity'] * data['unit_price'],
            product_id=data['product_id'],
            buyer_id=data['buyer_id']
        )
        db.session.add(transaction)
        
        # Update product status
        product = Product.query.get(data['product_id'])
        product.status = 'sold'
        
        db.session.commit()
        return jsonify({'id': transaction.id, 'message': 'Transaction created successfully'}), 201

@app.route('/api/payments', methods=['GET', 'POST'])
def payments():
    if request.method == 'GET':
        payments = Payment.query.all()
        return jsonify([{
            'id': payment.id,
            'amount': payment.amount,
            'payment_date': payment.payment_date.isoformat(),
            'payment_method': payment.payment_method,
            'status': payment.status,
            'due_date': payment.due_date.isoformat() if payment.due_date else None,
            'member_name': payment.member.name
        } for payment in payments])
    
    elif request.method == 'POST':
        data = request.get_json()
        payment = Payment(
            amount=data['amount'],
            payment_method=data['payment_method'],
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
            member_id=data['member_id'],
            transaction_id=data.get('transaction_id')
        )
        db.session.add(payment)
        db.session.commit()
        return jsonify({'id': payment.id, 'message': 'Payment created successfully'}), 201

@app.route('/api/traceability/<code>', methods=['GET'])
def traceability(code):
    product = Product.query.filter_by(traceability_code=code).first()
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    transactions = Transaction.query.filter_by(product_id=product.id).all()
    
    trace_info = {
        'product': {
            'name': product.name,
            'quantity': product.quantity,
            'unit': product.unit,
            'collection_date': product.collection_date.isoformat(),
            'quality_grade': product.quality_grade,
            'traceability_code': product.traceability_code
        },
        'member': {
            'name': product.member.name,
            'email': product.member.email
        },
        'transactions': [{
            'quantity': t.quantity,
            'unit_price': t.unit_price,
            'total_amount': t.total_amount,
            'transaction_date': t.transaction_date.isoformat(),
            'buyer_name': t.buyer.name
        } for t in transactions]
    }
    
    return jsonify(trace_info)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
