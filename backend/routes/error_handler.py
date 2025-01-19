from flask import Blueprint, jsonify

error_handler_bp = Blueprint('error_handler', __name__)

@error_handler_bp.errorhandler(400)
def handle_bad_request(error):
    return jsonify({
        "error": "Bad Request",
        "message": str(error.description) if error.description else "The request could not be understood by the server."
    }), 400

@error_handler_bp.errorhandler(AttributeError)
def handle_attribute_error(error):
    return jsonify({
        'error': 'Attribute Error',
        'message': str(error),
        'details': 'It looks like you tried to access an attribute that does not exist.'
    }), 400

@error_handler_bp.errorhandler(404)
def handle_not_found(error):
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found on the server."
    }), 404

@error_handler_bp.errorhandler(405)
def handle_method_not_allowed(error):
    return jsonify({
        "error": "Method Not Allowed",
        "message": f"The method {error.method} is not allowed for the requested URL."
    }), 405

@error_handler_bp.errorhandler(500)
def handle_internal_server_error(error):
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred on the server."
    }), 500

@error_handler_bp.errorhandler(Exception)
def handle_exception(error):
    return jsonify({
        "error": "An unexpected error occurred",
        "message": str(error)
    }), 500