"""Combine current_weight and target_weight into weight

Revision ID: 4ff781ae0607
Revises: c86371c81658
Create Date: 2025-02-02 09:30:20.923279

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4ff781ae0607'
down_revision = 'c86371c81658'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('weight', sa.String(length=10), nullable=True))
        batch_op.drop_column('target_weight')
        batch_op.drop_column('current_weight')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('current_weight', sa.VARCHAR(length=10), nullable=True))
        batch_op.add_column(sa.Column('target_weight', sa.VARCHAR(length=10), nullable=True))
        batch_op.drop_column('weight')

    # ### end Alembic commands ###
