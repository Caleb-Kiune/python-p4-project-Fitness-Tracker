"""Updated models to match schema

Revision ID: b8b0d4b3bb28
Revises: c1a3c479d173
Create Date: 2025-01-29 19:29:34.390990

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8b0d4b3bb28'
down_revision = 'c1a3c479d173'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exercise', schema=None) as batch_op:
        batch_op.drop_constraint('fk_exercise_workout_id_workout', type_='foreignkey')
        batch_op.drop_column('workout_id')

    with op.batch_alter_table('workout', schema=None) as batch_op:
        batch_op.drop_constraint('fk_workout_user_id_user', type_='foreignkey')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('workout', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_workout_user_id_user', 'user', ['user_id'], ['id'])

    with op.batch_alter_table('exercise', schema=None) as batch_op:
        batch_op.add_column(sa.Column('workout_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_exercise_workout_id_workout', 'workout', ['workout_id'], ['id'])

    # ### end Alembic commands ###
